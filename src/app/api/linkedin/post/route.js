import { NextResponse } from 'next/server';


export async function POST(request) {
  const body = await request.json();
  const token = body.token
  const postContent = body.post
  console.log('token', token)
  console.log('post', postContent)

  const response = await fetch('http://0.0.0.0:8000/rest/linkedin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "text": postContent, "token": token }),
    });
    const data = await response.json();
  const res = NextResponse.json(data)
  res.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  return res;
}