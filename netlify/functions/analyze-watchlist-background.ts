import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const baseUrl = process.env.URL || 'http://localhost:3000';
    const secret = process.env.CRON_SECRET;
    
    if (!secret) {
      console.error('[Background] CRON_SECRET is not defined');
      return new Response(JSON.stringify({ error: 'Configuration error' }), { status: 500 });
    }

    console.log(`[Background] Starting analysis job at ${baseUrl}/api/analyze-watchlist`);

    const response = await fetch(`${baseUrl}/api/analyze-watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      }
    });

    const data = await response.json();
    console.log('[Background] Analysis job completed:', data);

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error('[Background] Function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};
