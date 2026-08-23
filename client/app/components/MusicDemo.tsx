'use client';

import { FormEvent, useRef, useState } from 'react';

type Prediction = { genre: string; confidence: number };
type MusicResult = {
  genre: string;
  confidence: number;
  analyzed_seconds: number;
  top_predictions: Prediction[];
};

const MAX_AUDIO_SIZE = 60 * 1024 * 1024;

export default function MusicDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MusicResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('Upload a track and the model will analyze its first 10 seconds.');
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFile(selected?: File) {
    setResult(null);
    setStatus('idle');
    if (!selected) return setFile(null);
    if (selected.size > MAX_AUDIO_SIZE) {
      setFile(null);
      setStatus('error');
      setMessage('Audio must be smaller than 60 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setFile(selected);
    setMessage(`${selected.name} is ready to classify.`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setStatus('error');
      setMessage('Choose an audio file first.');
      return;
    }

    const body = new FormData();
    body.append('audio', file);
    setStatus('loading');
    setMessage('Extracting MFCC features and running the classifier…');

    try {
      const response = await fetch('/api/v1/music/classify', { method: 'POST', body });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Classification failed.');
      setResult(payload);
      setStatus('idle');
      setMessage(`Analyzed ${payload.analyzed_seconds.toFixed(1)} seconds of audio.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not reach the classifier.');
    }
  }

  return (
    <form className="labPanel musicPanel" onSubmit={submit}>
      <div className="labPanelTop"><span>MFCC / RANDOM FOREST</span><i>10 GENRES</i></div>
      <label className={`miniDropZone ${file ? 'hasFile' : ''}`}>
        <input ref={inputRef} type="file" accept="audio/*,.wav,.mp3,.ogg,.flac,.m4a,.aac" onChange={(event) => chooseFile(event.target.files?.[0])} />
        <span aria-hidden="true">♫</span>
        <strong>{file?.name || 'Choose an audio track'}</strong>
        <small>WAV, MP3, FLAC, M4A · MAX 60 MB</small>
      </label>
      {result && (
        <div className="genreResult">
          <p>Predicted genre</p>
          <strong>{result.genre}</strong>
          <span>{Math.round(result.confidence * 100)}% confidence</span>
          <div className="predictionBars">
            {result.top_predictions.map((item) => (
              <div key={item.genre}><label><span>{item.genre}</span><b>{Math.round(item.confidence * 100)}%</b></label><i style={{ width: `${item.confidence * 100}%` }} /></div>
            ))}
          </div>
        </div>
      )}
      <div className="labAction"><p className={status === 'error' ? 'error' : ''}>{message}</p><button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Analyzing…' : 'Classify track'} <span>↗</span></button></div>
    </form>
  );
}
