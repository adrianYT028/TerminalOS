// Vercel API route entry point
import express from "express";
import { connectDB } from "../server/db.ts";
import { registerRoutes } from "../server/routes.ts";
import { serveStatic } from "../server/vite.ts";

let app;
let initialized = false;

// Initialize the Express app for serverless
async function initializeApp() {
  if (!initialized) {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Add CORS headers
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Connect to MongoDB
    await connectDB();
    
    // Register routes  
    await registerRoutes(app);
    
    // Error handler
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files in production
    serveStatic(app);
    
    initialized = true;
  }
  return app;
}

export default async function handler(req, res) {
  // Set NODE_ENV for production
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'DATABASE_URL environment variable is not set. Please add it in Vercel dashboard → Settings → Environment Variables'
    });
  }

  try {
    const expressApp = await initializeApp();
    expressApp(req, res);
  } catch (error) {
    console.error('Failed to handle request:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
