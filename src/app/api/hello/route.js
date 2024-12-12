import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'Hello from API!' });
}

export async function POST(request) {
  const body = await request.json();
  const newLink = body.url
  console.log(newLink)
  const response = await fetch('http://0.0.0.0:8000/rest/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "url": newLink }),
    });
    const data = await response.json();
  const res = NextResponse.json(data)
  res.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  return res;
}