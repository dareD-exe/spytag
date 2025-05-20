export default async function handler(request, response) {
  const { tag } = request.query;
  const encodedTag = encodeURIComponent(tag);
  const cocApiToken = process.env.COC_API_KEY;

  if (!cocApiToken) {
    console.error("COC_API_KEY is not defined in serverless function.");
    return response.status(500).json({ error: 'COC API Key not configured on the server' });
  }

  const targetUrl = `https://api.clashofclans.com/v1/players/${encodedTag}`;

  try {
    console.log(`[Serverless] Attempting to fetch player: ${targetUrl}`);
    console.log(`[Serverless] COC_API_KEY available: ${cocApiToken ? 'Yes' : 'No'}`);
    console.log(`[Serverless] FIXIE_URL (should be set in Vercel env): ${process.env.FIXIE_URL ? 'Yes' : 'No'}`);

    const cocResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cocApiToken}`,
        'Accept': 'application/json',
      },
    });

    const responseBodyText = await cocResponse.text();

    if (!cocResponse.ok) {
      console.error(`[Serverless] CoC API Error (${cocResponse.status}): ${cocResponse.statusText}`, responseBodyText);
      let errorDetails = responseBodyText;
      try {
        errorDetails = JSON.parse(responseBodyText);
      } catch (e) {
        // Not JSON, use as text
      }
      return response.status(cocResponse.status).json({ error: `CoC API Error: ${cocResponse.statusText}`, details: errorDetails });
    }

    try {
      const data = JSON.parse(responseBodyText);
      return response.status(200).json(data);
    } catch (e) {
      console.error(`[Serverless] CoC API Success Response - JSON parsing error: ${e.message}`, responseBodyText);
      return response.status(500).json({ error: 'Failed to parse CoC API success response', details: responseBodyText });
    }

  } catch (error) {
    console.error('[Serverless] Error fetching player data:', error);
    return response.status(500).json({ error: 'Failed to fetch player data', details: error.message });
  }
}