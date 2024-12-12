import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'Hello from API!' });
}

export async function POST(request) {
  const body = await request.json();
  const context = body.context
  const response = await fetch('http://0.0.0.0:8000/rest/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "text": context }),
    });
    const data = await response.json();
  const res = NextResponse.json(data)
  res.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  return res;
}