FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    HF_HOME=/home/user/.cache/huggingface

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg libgomp1 \
    && useradd --create-home --uid 1000 user \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p ${HF_HOME} && chown -R user:user /home/user

USER user
RUN python -c "from huggingface_hub import snapshot_download; snapshot_download('Systran/faster-whisper-tiny')"

COPY --chown=user:user . .

EXPOSE 8080

CMD exec gunicorn --bind 0.0.0.0:${PORT} --workers 1 --threads 4 --timeout 900 app:app
