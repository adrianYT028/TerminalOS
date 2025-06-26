import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertMoodSchema, insertReflectionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(validatedTask);
      res.json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedTask = await storage.updateTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  // Mood routes
  app.get("/api/moods", async (req, res) => {
    try {
      const moods = await storage.getMoods();
      res.json(moods);
    } catch (error) {
      console.error("Error fetching moods:", error);
      res.status(500).json({ error: "Failed to fetch moods" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const validatedMood = insertMoodSchema.parse(req.body);
      const newMood = await storage.createMood(validatedMood);
      res.json(newMood);
    } catch (error) {
      console.error("Error creating mood:", error);
      res.status(400).json({ error: "Failed to create mood" });
    }
  });

  // Reflection routes
  app.get("/api/reflections", async (req, res) => {
    try {
      const reflections = await storage.getReflections();
      res.json(reflections);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      res.status(500).json({ error: "Failed to fetch reflections" });
    }
  });

  app.post("/api/reflections", async (req, res) => {
    try {
      const validatedReflection = insertReflectionSchema.parse(req.body);
      const newReflection = await storage.createReflection(validatedReflection);
      res.json(newReflection);
    } catch (error) {
      console.error("Error creating reflection:", error);
      res.status(400).json({ error: "Failed to create reflection" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
