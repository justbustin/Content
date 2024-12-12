import { NextResponse } from 'next/server';

export async function GET(request) {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const redirectUri = `http://localhost:3000/api/linkedin/callback`;
  const state = "randomStringOrHashForSecurity"; // Replace with a dynamically generated value if needed.
  const scope = "openid%20profile%20email%20w_member_social"; // Adjust scope as needed.

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  return NextResponse.redirect(linkedinAuthUrl);
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