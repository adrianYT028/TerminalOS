// Vercel API route entry point
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';

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

// Database Models
const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

const MoodSchema = new mongoose.Schema({
  mood: { type: String, enum: ["happy", "neutral", "sad", "excited", "tired", "stressed"], required: true },
  note: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const ReflectionSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CommandHistorySchema = new mongoose.Schema({
  command: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  output: { type: String }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const Mood = mongoose.models.Mood || mongoose.model('Mood', MoodSchema);
const Reflection = mongoose.models.Reflection || mongoose.model('Reflection', ReflectionSchema);
const CommandHistory = mongoose.models.CommandHistory || mongoose.model('CommandHistory', CommandHistorySchema);

// Helper function to parse request body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to MongoDB
    await connectDB();

    const { url: path, method } = req;

    // API Routes
    if (path.startsWith('/api/')) {
      
      // Tasks API
      if (path === '/api/tasks') {
        if (method === 'GET') {
          const tasks = await Task.find().sort({ createdAt: -1 });
          return res.status(200).json(tasks);
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const task = new Task(body);
          await task.save();
          return res.status(201).json(task);
        }
      }

      if (path.startsWith('/api/tasks/') && method === 'PUT') {
        const id = path.split('/')[3];
        const body = await parseBody(req);
        const task = await Task.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json(task);
      }

      if (path.startsWith('/api/tasks/') && method === 'DELETE') {
        const id = path.split('/')[3];
        await Task.findByIdAndDelete(id);
        return res.status(200).json({ success: true });
      }

      // Moods API
      if (path === '/api/moods') {
        if (method === 'GET') {
          const moods = await Mood.find().sort({ timestamp: -1 });
          return res.status(200).json(moods);
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const mood = new Mood(body);
          await mood.save();
          return res.status(201).json(mood);
        }
      }

      // Reflections API
      if (path === '/api/reflections') {
        if (method === 'GET') {
          const reflections = await Reflection.find().sort({ timestamp: -1 });
          return res.status(200).json(reflections);
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const reflection = new Reflection(body);
          await reflection.save();
          return res.status(201).json(reflection);
        }
      }

      if (path.startsWith('/api/reflections/') && method === 'DELETE') {
        const id = path.split('/')[3];
        await Reflection.findByIdAndDelete(id);
        return res.status(200).json({ success: true });
      }

      // Command History API
      if (path === '/api/command-history') {
        if (method === 'GET') {
          const history = await CommandHistory.find().sort({ timestamp: -1 }).limit(100);
          return res.status(200).json(history);
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const command = new CommandHistory(body);
          await command.save();
          return res.status(201).json(command);
        }
      }

      return res.status(404).json({ error: 'API endpoint not found' });
    }

    // Serve static frontend files
    if (path === '/' || !path.includes('.')) {
      try {
        const indexPath = join(process.cwd(), 'dist', 'public', 'index.html');
        const html = readFileSync(indexPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      } catch (error) {
        // Fallback HTML if index.html not found
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>TerminalOS</title>
            <style>
              body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 20px; margin: 0; }
              .terminal { background: #111; padding: 20px; border-radius: 8px; max-width: 800px; margin: 0 auto; }
              .status { color: #00ff00; }
              .error { color: #ff0000; }
              a { color: #00aa00; text-decoration: none; }
              a:hover { color: #00ff00; text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="terminal">
              <h1>TerminalOS</h1>
              <p class="status">Status: Online ✅</p>
              <p class="status">Database: Connected ✅</p>
              <p class="status">API: Functional ✅</p>
              <br>
              <h3>Available API Endpoints:</h3>
              <ul>
                <li><a href="/api/tasks">GET /api/tasks</a> - List all tasks</li>
                <li><a href="/api/moods">GET /api/moods</a> - List all moods</li>
                <li><a href="/api/reflections">GET /api/reflections</a> - List all reflections</li>
                <li><a href="/api/command-history">GET /api/command-history</a> - Command history</li>
              </ul>
              <br>
              <p><em>TerminalOS is running in serverless mode on Vercel.</em></p>
            </div>
          </body>
          </html>
        `);
      }
    }

    // Serve static assets
    if (path.includes('.')) {
      try {
        const assetPath = join(process.cwd(), 'dist', 'public', path);
        const content = readFileSync(assetPath);
        
        // Set appropriate content type
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html');
        }
        
        return res.status(200).send(content);
      } catch (error) {
        return res.status(404).json({ error: 'File not found' });
      }
    }

    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
