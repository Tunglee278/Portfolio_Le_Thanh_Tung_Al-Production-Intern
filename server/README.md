# Portfolio Projects API

One hosting-ready Flask service for the three portfolio projects: Subtitle AI, Music Genre Classification, and Food Ordering Analytics.

## Security first

The original source contained a Gemini API key in `app.py`. Revoke that key before publishing the old project. This version reads `GEMINI_API_KEY` only from the environment and never stores it in source control.

## API

- `GET /health`
- `POST /v1/subtitles`
  - multipart field: `video`
  - form field: `output=srt` or `output=video`
- `GET /v1/music/genres`
- `POST /v1/music/classify`
  - multipart field: `audio`
  - supports WAV, MP3, OGG, FLAC, M4A and AAC
- `GET /v1/food/products`
- `POST /v1/food/orders`
- `GET /v1/food/analytics/summary`

Example:

```powershell
curl.exe -X POST http://localhost:8080/v1/subtitles `
  -F "video=@sample.mp4" `
  -F "output=srt" `
  --output subtitle.srt
```

## Run locally on Windows

Install FFmpeg and make sure `ffmpeg.exe` is available on `PATH`, then run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

Environment values from `.env` are not loaded automatically. Set them in PowerShell before starting the app, or use an environment loader in your preferred deployment platform. Gemini correction is disabled by default.

Set `MONGO_URI` to a MongoDB Atlas connection string for the Food API. Never commit the URI. The original Food backend contained an exposed database password; rotate that Atlas database user's password before deploying.

## Run with Docker

```powershell
docker build -t subtitle-api .
docker run --rm -p 8080:8080 `
  -e WHISPER_MODEL=small `
  -e WHISPER_DEVICE=cpu `
  -e ALLOWED_ORIGINS=http://localhost:3000 `
  portfolio-api
```

The first transcription downloads the selected Faster-Whisper model, so it takes longer than later requests.

## Deploy to Cloud Run

The included container works in CPU mode. A simple first deployment is:

```powershell
gcloud run deploy portfolio-api `
  --source . `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --cpu 2 `
  --memory 4Gi `
  --timeout 900 `
  --concurrency 1 `
  --max-instances 1 `
  --set-env-vars WHISPER_MODEL=small,WHISPER_DEVICE=cpu,WHISPER_COMPUTE_TYPE=int8,FOOD_DB_NAME=TungFoodDB
```

For the `medium` model and faster inference, deploy with an NVIDIA GPU-compatible image and configure a Cloud Run GPU. Keep concurrency at one because the model is loaded once per instance and inference is resource intensive.

After deployment, set:

- `ALLOWED_ORIGINS` to the exact portfolio production URL.
- `GEMINI_API_KEY` through the provider's secret manager, never through source code.
- `MONGO_URI` through Secret Manager. Do not place credentials in `--set-env-vars` or source code.
- `ENABLE_GEMINI_CORRECTION=true` only after the secret is configured.

## Changes from the original source

- Removed the embedded API key and Flask debug mode.
- Corrected dependencies to `faster-whisper` and `google-genai`.
- Replaced shared filenames with an isolated temporary directory per request.
- Added upload validation, size limits, CORS, health checks, cleanup and structured errors.
- Uses FFmpeg directly instead of MoviePy, reducing dependencies and memory overhead.
- Supports both SRT download and optional subtitle burn-in.
