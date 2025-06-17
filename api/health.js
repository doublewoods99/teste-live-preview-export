// Using default Node.js runtime for compatibility with Vercel Functions

export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    response.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PDF Export Serverless Function',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    response.status(500).json({
      status: 'error',
      error: error.message
    });
  }
} 