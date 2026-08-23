const configuredApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim();

export const API_BASE_URL = (configuredApiUrl || '/api').replace(/\/$/, '');

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
