# Le Thanh Tung - AI Engineer Portfolio

## Project structure

```text
client/              Next.js portfolio frontend
server/              Flask + Faster-Whisper Docker backend
server/middlewares/  CORS and API error middleware
social-card-output/  Generated social preview source
```

Run the frontend from `client/` and the backend from `server/`.

## Free deployment

- Deploy `server/` as a free Docker Web Service on Render using `render.yaml`.
- Deploy `client/` on Vercel with Root Directory set to `client`.
- In Vercel, set `NEXT_PUBLIC_BACKEND_API_URL` to the public `.onrender.com` backend URL.
- In Vercel, set `NEXT_PUBLIC_SITE_URL` to the final Vercel or custom-domain URL.
- In Render, set `ALLOWED_ORIGINS` to the exact Vercel production URL and keep `MONGO_URI` and `GEMINI_API_KEY` in environment secrets.

The live demos upload directly from the browser to the backend. Video and audio files are capped at 25 MB to fit the free CPU hosting profile more reliably.
