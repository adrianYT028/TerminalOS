// Vercel API route entry point
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'DATABASE_URL environment variable is not set'
    });
  }

  try {
    // Simple response for now to test if the function works
    if (req.url === '/') {
      return res.status(200).json({
        message: 'TerminalOS API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // Handle API routes
    if (req.url.startsWith('/api/')) {
      return res.status(200).json({
        message: 'API endpoint hit',
        path: req.url,
        method: req.method
      });
    }

    // Default response
    return res.status(404).json({
      error: 'Not Found',
      message: 'Route not found',
      path: req.url
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
