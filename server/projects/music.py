import os
import shutil
import tempfile
import threading
from functools import lru_cache
from pathlib import Path

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename


music_blueprint = Blueprint("music", __name__, url_prefix="/v1/music")

MODEL_DIRECTORY = Path(__file__).resolve().parent / "models"
MODEL_PATH = MODEL_DIRECTORY / "model.pkl"
SCALER_PATH = MODEL_DIRECTORY / "scaler.pkl"
ALLOWED_AUDIO_EXTENSIONS = {"wav", "mp3", "ogg", "flac", "m4a", "aac"}
MAX_MUSIC_UPLOAD_MB = int(os.getenv("MAX_MUSIC_UPLOAD_MB", "60"))
_model_lock = threading.Lock()


def _allowed_audio(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_AUDIO_EXTENSIONS


@lru_cache(maxsize=1)
def _load_artifacts():
    import joblib

    if not MODEL_PATH.exists() or not SCALER_PATH.exists():
        raise FileNotFoundError("Music model artifacts are missing.")
    return joblib.load(MODEL_PATH), joblib.load(SCALER_PATH)


def music_model_status() -> dict:
    return {
        "available": MODEL_PATH.exists() and SCALER_PATH.exists(),
        "loaded": _load_artifacts.cache_info().currsize > 0,
    }


def _extract_features(audio_path: Path):
    import librosa
    import numpy as np

    audio, sample_rate = librosa.load(str(audio_path), duration=10, mono=True)
    if audio.size == 0:
        raise ValueError("The audio file is empty.")
    mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    return np.mean(mfcc.T, axis=0), float(librosa.get_duration(y=audio, sr=sample_rate))


@music_blueprint.get("/genres")
def genres():
    try:
        model, _scaler = _load_artifacts()
        return jsonify(genres=[str(label) for label in model.classes_])
    except Exception:
        return jsonify(error="Music classifier is not available."), 503


@music_blueprint.post("/classify")
def classify_music():
    if request.content_length and request.content_length > MAX_MUSIC_UPLOAD_MB * 1024 * 1024:
        return jsonify(error=f"Audio file exceeds the {MAX_MUSIC_UPLOAD_MB} MB limit."), 413

    uploaded_file = request.files.get("audio")
    if uploaded_file is None or not uploaded_file.filename:
        return jsonify(error="An audio file is required in the 'audio' field."), 400
    if not _allowed_audio(uploaded_file.filename):
        return jsonify(error="Unsupported audio format."), 415

    workdir = Path(tempfile.mkdtemp(prefix="music-job-"))
    audio_path = workdir / secure_filename(uploaded_file.filename)

    try:
        uploaded_file.save(audio_path)
        features, analyzed_seconds = _extract_features(audio_path)
        model, scaler = _load_artifacts()
        normalized = scaler.transform([features])

        with _model_lock:
            prediction = str(model.predict(normalized)[0])
            probabilities = model.predict_proba(normalized)[0]

        ranked = sorted(
            (
                {"genre": str(label), "confidence": round(float(score), 4)}
                for label, score in zip(model.classes_, probabilities)
            ),
            key=lambda item: item["confidence"],
            reverse=True,
        )
        return jsonify(
            filename=secure_filename(uploaded_file.filename),
            genre=prediction,
            confidence=ranked[0]["confidence"],
            top_predictions=ranked[:3],
            analyzed_seconds=round(analyzed_seconds, 2),
        )
    except ValueError as error:
        return jsonify(error=str(error)), 422
    except Exception:
        current_app.logger.exception("Music classification failed.")
        return jsonify(error="Music classification failed."), 500
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
