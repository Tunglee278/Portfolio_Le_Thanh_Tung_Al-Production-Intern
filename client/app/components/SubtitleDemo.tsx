'use client';

import { FormEvent, useRef, useState } from 'react';

type OutputType = 'srt' | 'video';
type RequestState = 'idle' | 'processing' | 'success' | 'error';

const MAX_FILE_SIZE = 250 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SubtitleDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<OutputType>('srt');
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const apiUrl = '/api';

  function chooseFile(selectedFile?: File) {
    setMessage('');
    setRequestState('idle');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setRequestState('error');
      setMessage('Video must be smaller than 250 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setRequestState('error');
      setMessage('Choose a video before starting.');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setRequestState('processing');
    setMessage('Uploading and transcribing. The first request may take a few minutes while the model loads.');

    const body = new FormData();
    body.append('video', file);
    body.append('output', output);

    try {
      const response = await fetch(`${apiUrl}/v1/subtitles`, {
        method: 'POST',
        body,
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `Request failed with status ${response.status}.`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = output === 'srt' ? 'subtitle.srt' : 'subtitled-video.mp4';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30_000);

      setRequestState('success');
      setMessage(`Done — ${link.download} has been downloaded.`);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setRequestState('idle');
        setMessage('Request cancelled.');
      } else {
        setRequestState('error');
        setMessage(error instanceof Error ? error.message : 'Could not reach the subtitle API.');
      }
    } finally {
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  return (
    <form className="demoConsole" onSubmit={submit}>
      <div className="consoleBar">
        <span><i /> LIVE PIPELINE</span>
        <span>SAME-ORIGIN API</span>
      </div>

      <label
        className={`dropZone ${file ? 'hasFile' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          chooseFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-matroska,video/webm,video/x-msvideo"
          onChange={(event) => chooseFile(event.target.files?.[0])}
          disabled={requestState === 'processing'}
        />
        <span className="uploadIcon" aria-hidden="true">↥</span>
        {file ? (
          <span className="fileDetails"><strong>{file.name}</strong><small>{formatFileSize(file.size)} · READY TO PROCESS</small></span>
        ) : (
          <span className="fileDetails"><strong>Drop a video here</strong><small>OR CLICK TO BROWSE · MP4, MOV, MKV, WEBM · MAX 250 MB</small></span>
        )}
      </label>

      <fieldset className="outputPicker" disabled={requestState === 'processing'}>
        <legend>Choose output</legend>
        <label className={output === 'srt' ? 'selected' : ''}>
          <input type="radio" name="output" value="srt" checked={output === 'srt'} onChange={() => setOutput('srt')} />
          <span><strong>.SRT file</strong><small>Fastest · editable subtitles</small></span>
        </label>
        <label className={output === 'video' ? 'selected' : ''}>
          <input type="radio" name="output" value="video" checked={output === 'video'} onChange={() => setOutput('video')} />
          <span><strong>Subtitled video</strong><small>FFmpeg burn-in · MP4</small></span>
        </label>
      </fieldset>

      <div className="demoActionRow">
        <p className={`demoStatus ${requestState}`} role="status" aria-live="polite">
          {requestState === 'processing' && <i aria-hidden="true" />}
          {message || 'Your video stays in a temporary processing directory and is deleted after the response.'}
        </p>
        {requestState === 'processing' ? (
          <button className="processButton cancelButton" type="button" onClick={cancel}>Cancel</button>
        ) : (
          <button className="processButton" type="submit">Generate subtitles <span aria-hidden="true">↗</span></button>
        )}
      </div>
    </form>
  );
}
