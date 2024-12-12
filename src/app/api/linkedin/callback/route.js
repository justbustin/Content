import { NextResponse } from 'next/server';

export async function GET(request) {
  // Correctly extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Validate code
  if (state !== 'randomStringOrHashForSecurity') {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
  }

  try {
    // Explicitly construct the request body
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code', // Ensure this is explicitly set
      code: code,
      client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/api/linkedin/callback'
    });

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams
    });

    // Check if the response is successful
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('LinkedIn Token Exchange Error:', errorText);
      return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
    }

    const data = await tokenResponse.json();
    const accessToken = data.access_token;
    /*
    console.log('Access Token:', accessToken);
    const user_info_url = 'https://www.linkedin.com/oauth/v2/userinfo';
    const headers = {'Authorization': 'Bearer ' + accessToken};

    try {
    const user_info_response = await fetch(user_info_url, {headers});

    if (!user_info_response.ok) {
        console.log('user_info_response', user_info_response)
        throw new Error(user_info_response);
    }

    const user_info = await user_info_response.json();

    // Extract the URN from the user_info object
    const urn = user_info.sub;

    console.log("User URN:", urn);
    } catch (error) {
    console.error("Error retrieving user information:", error.message);
    }
*/
    // Redirect with the access token
    return NextResponse.redirect(`http://localhost:3000/generate?token=${accessToken}`);

  } catch (error) {
    console.error('LinkedIn Callback Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
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