// Vercel API route entry point
import mongoose from 'mongoose';

// MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Simple task model for testing
const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

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
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'DATABASE_URL environment variable is not set'
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Route handling
    if (req.url === '/') {
      return res.status(200).json({
        message: 'TerminalOS API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected to MongoDB Atlas'
      });
    }

    // Test API route - get tasks
    if (req.url === '/api/tasks' && req.method === 'GET') {
      const tasks = await Task.find().limit(10);
      return res.status(200).json(tasks);
    }

    // Test API route - create task
    if (req.url === '/api/tasks' && req.method === 'POST') {
      const body = req.body || {};
      const task = new Task({
        description: body.description || 'Test task from Vercel'
      });
      await task.save();
      return res.status(201).json(task);
    }

    // Handle other API routes
    if (req.url.startsWith('/api/')) {
      return res.status(200).json({
        message: 'API endpoint hit',
        path: req.url,
        method: req.method,
        database: 'MongoDB connected'
      });
    }

    // Default response - serve a simple HTML page
    if (req.url === '/') {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TerminalOS</title>
          <style>
            body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 20px; }
            .terminal { background: #111; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="terminal">
            <h1>TerminalOS</h1>
            <p>Status: Online ✅</p>
            <p>Database: Connected ✅</p>
            <p>API: Functional ✅</p>
            <p><a href="/api/tasks" style="color: #00ff00;">Test API: /api/tasks</a></p>
          </div>
        </body>
        </html>
      `);
    }

    // 404 for unknown routes
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
