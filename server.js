// Azure App Service entry point
// This file is required by Azure App Service for Node.js applications

// Set NODE_ENV for production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Import and start the application
import('./dist/index.js')
  .then(() => {
    console.log('TerminalOS application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start TerminalOS application:', error);
    process.exit(1);
  });
