import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: NextRequest, context: RouteContext) {
  const backendOrigin = process.env.BACKEND_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : '');

  if (!backendOrigin) {
    return NextResponse.json(
      { error: 'The portfolio backend is not configured.' },
      { status: 503 },
    );
  }

  const { path } = await context.params;
  const target = new URL(`/${path.join('/')}`, backendOrigin);
  target.search = request.nextUrl.search;

  try {
    const upstreamRequest = new Request(target, request);
    const response = await fetch(upstreamRequest);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not reach the portfolio backend.' },
      { status: 502 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
