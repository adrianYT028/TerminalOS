// Vercel serverless function entry point
// Set NODE_ENV for production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please add DATABASE_URL in Vercel dashboard → Settings → Environment Variables');
  process.exit(1);
}

// Import and start the application
import('./dist/index.js')
  .then(() => {
    console.log('TerminalOS application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start TerminalOS application:', error);
    process.exit(1);
  });
