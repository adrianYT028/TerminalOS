import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Parse the URL
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    if (url.pathname.startsWith('/api')) {
      const { storage } = await import('../server/storage');
      
      // Tasks endpoints
      if (url.pathname === '/api/tasks' && req.method === 'GET') {
        try {
          const tasks = await storage.getTasks();
          return res.status(200).json(tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
      } else if (url.pathname === '/api/tasks' && req.method === 'POST') {
        try {
          const { insertTaskSchema } = await import('../shared/schema');
          const validatedTask = insertTaskSchema.parse(req.body);
          const newTask = await storage.createTask(validatedTask);
          return res.status(201).json(newTask);
        } catch (error) {
          console.error('Error creating task:', error);
          return res.status(400).json({ error: 'Failed to create task' });
        }
      } else if (url.pathname.match(/^\/api\/tasks\/(.+)$/) && req.method === 'PATCH') {
        try {
          const match = url.pathname.match(/^\/api\/tasks\/(.+)$/);
          const id = match?.[1];
          if (!id) {
            return res.status(400).json({ error: 'Task ID required' });
          }
          const updatedTask = await storage.updateTask(id, req.body);
          return res.status(200).json(updatedTask);
        } catch (error) {
          console.error('Error updating task:', error);
          return res.status(400).json({ error: 'Failed to update task' });
        }
      } else if (url.pathname.match(/^\/api\/tasks\/(.+)$/) && req.method === 'DELETE') {
        try {
          const match = url.pathname.match(/^\/api\/tasks\/(.+)$/);
          const id = match?.[1];
          if (!id) {
            return res.status(400).json({ error: 'Task ID required' });
          }
          const deleted = await storage.deleteTask(id);
          return res.status(200).json({ success: deleted });
        } catch (error) {
          console.error('Error deleting task:', error);
          return res.status(400).json({ error: 'Failed to delete task' });
        }
      }
      
      // Moods endpoints
      else if (url.pathname === '/api/moods' && req.method === 'GET') {
        try {
          const moods = await storage.getMoods();
          return res.status(200).json(moods);
        } catch (error) {
          console.error('Error fetching moods:', error);
          return res.status(500).json({ error: 'Failed to fetch moods' });
        }
      } else if (url.pathname === '/api/moods' && req.method === 'POST') {
        try {
          const { insertMoodSchema } = await import('../shared/schema');
          const validatedMood = insertMoodSchema.parse(req.body);
          const newMood = await storage.createMood(validatedMood);
          return res.status(201).json(newMood);
        } catch (error) {
          console.error('Error creating mood:', error);
          return res.status(400).json({ error: 'Failed to create mood' });
        }
      }
      
      // Reflections endpoints
      else if (url.pathname === '/api/reflections' && req.method === 'GET') {
        try {
          const reflections = await storage.getReflections();
          return res.status(200).json(reflections);
        } catch (error) {
          console.error('Error fetching reflections:', error);
          return res.status(500).json({ error: 'Failed to fetch reflections' });
        }
      } else if (url.pathname === '/api/reflections' && req.method === 'POST') {
        try {
          const { insertReflectionSchema } = await import('../shared/schema');
          const validatedReflection = insertReflectionSchema.parse(req.body);
          const newReflection = await storage.createReflection(validatedReflection);
          return res.status(201).json(newReflection);
        } catch (error) {
          console.error('Error creating reflection:', error);
          return res.status(400).json({ error: 'Failed to create reflection' });
        }
      }
      
      // Command history endpoints
      else if (url.pathname === '/api/commands' && req.method === 'GET') {
        try {
          const commands = await storage.getCommandHistory();
          return res.status(200).json(commands);
        } catch (error) {
          console.error('Error fetching commands:', error);
          return res.status(500).json({ error: 'Failed to fetch commands' });
        }
      } else if (url.pathname === '/api/commands' && req.method === 'POST') {
        try {
          const newCommand = await storage.saveCommand(req.body);
          return res.status(201).json(newCommand);
        } catch (error) {
          console.error('Error saving command:', error);
          return res.status(400).json({ error: 'Failed to save command' });
        }
      }
      
      else {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
    } else {
      // For non-API routes, return a simple message since static files 
      // should be handled by Vercel's static file serving
      return res.status(200).json({ message: 'TerminalOS API is running' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
