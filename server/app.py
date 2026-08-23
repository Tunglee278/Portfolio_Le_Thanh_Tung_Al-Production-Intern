import json
import os
import shutil
import subprocess
import tempfile
import threading
from functools import lru_cache
from pathlib import Path

from flask import Flask, after_this_request, jsonify, request, send_file
from werkzeug.utils import secure_filename

from middlewares import configure_cors, register_error_handlers
from projects import food_blueprint, music_blueprint, music_model_status


ALLOWED_EXTENSIONS = {"mp4", "mov", "mkv", "webm", "avi", "m4v"}
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "250"))
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "medium")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv(
    "WHISPER_COMPUTE_TYPE",
    "float16" if WHISPER_DEVICE == "cuda" else "int8",
)
ENABLE_GEMINI_CORRECTION = os.getenv("ENABLE_GEMINI_CORRECTION", "false").lower() == "true"
MAX_WORDS_PER_SUBTITLE = int(os.getenv("MAX_WORDS_PER_SUBTITLE", "7"))

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
configure_cors(app, allowed_origins)
register_error_handlers(app, MAX_UPLOAD_MB)
app.register_blueprint(food_blueprint)
app.register_blueprint(music_blueprint)

_model_lock = threading.Lock()


@lru_cache(maxsize=1)
def get_whisper_model():
    from faster_whisper import WhisperModel

    return WhisperModel(
        WHISPER_MODEL,
        device=WHISPER_DEVICE,
        compute_type=WHISPER_COMPUTE_TYPE,
    )


def is_allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def format_srt_time(seconds: float) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1_000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def split_segment(text: str, start: float, end: float, max_words: int):
    words = text.split()
    if not words:
        return []

    chunks = [words[index:index + max_words] for index in range(0, len(words), max_words)]
    duration = max(0.01, end - start)
    chunk_duration = duration / len(chunks)

    return [
        {
            "start": start + (index * chunk_duration),
            "end": min(end, start + ((index + 1) * chunk_duration)),
            "text": " ".join(chunk),
        }
        for index, chunk in enumerate(chunks)
    ]


def improve_transcript(texts: list[str]) -> list[str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not ENABLE_GEMINI_CORRECTION or not api_key or not texts:
        return texts

    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        prompt = (
            "Correct Vietnamese spelling and punctuation in the JSON array below. "
            "Preserve meaning, order, and the exact number of array elements. "
            "Return only a valid JSON array of strings.\n\n"
            + json.dumps(texts, ensure_ascii=False)
        )
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=prompt,
        )
        corrected = json.loads(response.text.strip())
        if isinstance(corrected, list) and len(corrected) == len(texts):
            return [str(item).strip() for item in corrected]
    except Exception:
        app.logger.warning("Transcript correction failed; using the Whisper output.")

    return texts


def transcribe(audio_path: Path):
    with _model_lock:
        segments, info = get_whisper_model().transcribe(
            str(audio_path),
            language=os.getenv("TRANSCRIPTION_LANGUAGE", "vi"),
            beam_size=int(os.getenv("WHISPER_BEAM_SIZE", "3")),
            vad_filter=True,
            initial_prompt=os.getenv(
                "WHISPER_INITIAL_PROMPT",
                "Video tiếng Việt về công nghệ, AI, dữ liệu, lập trình và ngành IT.",
            ),
        )
        segment_list = list(segments)

    texts = improve_transcript([segment.text.strip() for segment in segment_list])
    normalized = [
        {"start": segment.start, "end": segment.end, "text": texts[index]}
        for index, segment in enumerate(segment_list)
    ]
    return normalized, info


def write_srt(segments, destination: Path):
    subtitle_index = 1
    with destination.open("w", encoding="utf-8") as stream:
        for segment in segments:
            mini_segments = split_segment(
                segment["text"],
                segment["start"],
                segment["end"],
                MAX_WORDS_PER_SUBTITLE,
            )
            for mini in mini_segments:
                stream.write(f"{subtitle_index}\n")
                stream.write(
                    f"{format_srt_time(mini['start'])} --> "
                    f"{format_srt_time(mini['end'])}\n"
                )
                stream.write(f"{mini['text']}\n\n")
                subtitle_index += 1


def run_ffmpeg(arguments: list[str], working_directory: Path):
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *arguments],
        cwd=working_directory,
        check=True,
        timeout=int(os.getenv("FFMPEG_TIMEOUT_SECONDS", "900")),
    )


def extract_audio(video_path: Path, audio_path: Path, working_directory: Path):
    run_ffmpeg(
        ["-i", str(video_path), "-vn", "-ac", "1", "-ar", "16000", str(audio_path)],
        working_directory,
    )


def burn_subtitles(video_path: Path, output_path: Path, working_directory: Path):
    subtitle_filter = (
        "subtitles=subtitle.srt:force_style="
        "'FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF&,"
        "OutlineColour=&H000000&,Outline=3,Shadow=1,Bold=1,MarginV=50,Alignment=2'"
    )
    run_ffmpeg(
        [
            "-i", str(video_path),
            "-vf", subtitle_filter,
            "-c:v", os.getenv("VIDEO_ENCODER", "libx264"),
            "-preset", os.getenv("VIDEO_PRESET", "veryfast"),
            "-c:a", "copy",
            str(output_path),
        ],
        working_directory,
    )


@app.get("/health")
def health():
    return jsonify(
        status="ok",
        services={
            "subtitle": {
                "model": WHISPER_MODEL,
                "device": WHISPER_DEVICE,
                "model_loaded": get_whisper_model.cache_info().currsize > 0,
            },
            "music": music_model_status(),
            "food": {"configured": bool(os.getenv("MONGO_URI"))},
        },
    )


@app.post("/v1/subtitles")
def create_subtitles():
    uploaded_file = request.files.get("video")
    if uploaded_file is None or not uploaded_file.filename:
        return jsonify(error="A video file is required in the 'video' field."), 400

    if not is_allowed_file(uploaded_file.filename):
        return jsonify(error="Unsupported video format."), 415

    output_type = request.form.get("output", "srt").lower()
    if output_type not in {"srt", "video"}:
        return jsonify(error="The output field must be 'srt' or 'video'."), 400

    workdir = Path(tempfile.mkdtemp(prefix="subtitle-job-"))

    @after_this_request
    def schedule_temporary_file_cleanup(response):
        response.call_on_close(lambda: shutil.rmtree(workdir, ignore_errors=True))
        return response

    safe_name = secure_filename(uploaded_file.filename)
    video_path = workdir / safe_name
    audio_path = workdir / "audio.wav"
    subtitle_path = workdir / "subtitle.srt"
    output_video_path = workdir / "subtitled-video.mp4"
    uploaded_file.save(video_path)

    try:
        extract_audio(video_path, audio_path, workdir)
        segments, info = transcribe(audio_path)
        write_srt(segments, subtitle_path)

        app.logger.info(
            "Transcription completed: language=%s probability=%.3f segments=%d",
            getattr(info, "language", "unknown"),
            getattr(info, "language_probability", 0.0),
            len(segments),
        )

        if output_type == "video":
            burn_subtitles(video_path, output_video_path, workdir)
            return send_file(
                output_video_path,
                as_attachment=True,
                download_name="subtitled-video.mp4",
                mimetype="video/mp4",
            )

        return send_file(
            subtitle_path,
            as_attachment=True,
            download_name="subtitle.srt",
            mimetype="application/x-subrip",
        )
    except subprocess.TimeoutExpired:
        return jsonify(error="Video processing timed out."), 504
    except subprocess.CalledProcessError:
        app.logger.exception("FFmpeg failed to process the uploaded video.")
        return jsonify(error="The uploaded video could not be processed."), 422
    except Exception:
        app.logger.exception("Subtitle generation failed.")
        return jsonify(error="Subtitle generation failed."), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")), debug=False)
