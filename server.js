// Vercel serverless function entry point
export default async function handler(req, res) {
  // Set NODE_ENV for production
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  
  // Set Vercel environment flag
  process.env.VERCEL = 'true';

  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'DATABASE_URL environment variable is not set. Please add it in Vercel dashboard → Settings → Environment Variables'
    });
  }

  try {
    // Import the Express app getter
    const { default: getApp } = await import('./dist/index.js');
    
    // Get the initialized Express app
    const app = await getApp();
    
    // Handle the request through Express
    app(req, res);
  } catch (error) {
    console.error('Failed to load or execute server:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
