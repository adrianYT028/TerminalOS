// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import mongoose from "mongoose";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
var db_default = mongoose;

// server/storage.ts
var TaskModel = db_default.model("Task", new db_default.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
}));
var MoodModel = db_default.model("Mood", new db_default.Schema({
  mood: { type: String, enum: ["happy", "neutral", "sad", "excited", "tired", "stressed"], required: true },
  note: { type: String },
  timestamp: { type: Date, default: Date.now }
}));
var ReflectionModel = db_default.model("Reflection", new db_default.Schema({
  title: { type: String },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}));
var CommandHistoryModel = db_default.model("CommandHistory", new db_default.Schema({
  command: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  output: { type: String }
}));
var DatabaseStorage = class {
  // Task methods
  async getTasks() {
    const tasks = await TaskModel.find().sort({ createdAt: -1 });
    return tasks.map((task) => ({
      id: task._id.toString(),
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }));
  }
  async createTask(task) {
    const newTask = await TaskModel.create(task);
    return {
      id: newTask._id.toString(),
      description: newTask.description,
      completed: newTask.completed,
      priority: newTask.priority,
      createdAt: newTask.createdAt,
      completedAt: newTask.completedAt
    };
  }
  async updateTask(id, updates) {
    const updatedTask = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) return void 0;
    return {
      id: updatedTask._id.toString(),
      description: updatedTask.description,
      completed: updatedTask.completed,
      priority: updatedTask.priority,
      createdAt: updatedTask.createdAt,
      completedAt: updatedTask.completedAt
    };
  }
  async deleteTask(id) {
    const result = await TaskModel.findByIdAndDelete(id);
    return result !== null;
  }
  // Mood methods
  async getMoods() {
    const moods = await MoodModel.find().sort({ timestamp: -1 });
    return moods.map((mood) => ({
      id: mood._id.toString(),
      mood: mood.mood,
      note: mood.note,
      timestamp: mood.timestamp
    }));
  }
  async createMood(mood) {
    const newMood = await MoodModel.create(mood);
    return {
      id: newMood._id.toString(),
      mood: newMood.mood,
      note: newMood.note,
      timestamp: newMood.timestamp
    };
  }
  // Reflection methods
  async getReflections() {
    const reflections = await ReflectionModel.find().sort({ timestamp: -1 });
    return reflections.map((reflection) => ({
      id: reflection._id.toString(),
      title: reflection.title,
      content: reflection.content,
      timestamp: reflection.timestamp
    }));
  }
  async createReflection(reflection) {
    const newReflection = await ReflectionModel.create(reflection);
    return {
      id: newReflection._id.toString(),
      title: newReflection.title,
      content: newReflection.content,
      timestamp: newReflection.timestamp
    };
  }
  // Command history methods
  async getCommandHistory() {
    const commands = await CommandHistoryModel.find().sort({ timestamp: -1 }).limit(100);
    return commands.map((cmd) => ({
      id: cmd._id.toString(),
      command: cmd.command,
      timestamp: cmd.timestamp,
      output: cmd.output
    }));
  }
  async saveCommand(command) {
    const newCommand = await CommandHistoryModel.create(command);
    return {
      id: newCommand._id.toString(),
      command: newCommand.command,
      timestamp: newCommand.timestamp,
      output: newCommand.output
    };
  }
};
var storage = new DatabaseStorage();

// shared/schema.ts
import { z } from "zod";
var taskSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  description: z.string(),
  completed: z.boolean().default(false),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  createdAt: z.date().default(() => /* @__PURE__ */ new Date()),
  completedAt: z.date().optional()
});
var insertTaskSchema = taskSchema.omit({ _id: true, id: true });
var moodSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  mood: z.enum(["happy", "neutral", "sad", "excited", "tired", "stressed"]),
  note: z.string().optional(),
  timestamp: z.date().default(() => /* @__PURE__ */ new Date())
});
var insertMoodSchema = moodSchema.omit({ _id: true, id: true });
var reflectionSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  timestamp: z.date().default(() => /* @__PURE__ */ new Date())
});
var insertReflectionSchema = reflectionSchema.omit({ _id: true, id: true });
var commandHistorySchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  command: z.string(),
  timestamp: z.date().default(() => /* @__PURE__ */ new Date()),
  output: z.string().optional()
});
var insertCommandHistorySchema = commandHistorySchema.omit({ _id: true, id: true });
var systemStatsSchema = z.object({
  tasksCompletedToday: z.number().default(0),
  pendingTasks: z.number().default(0),
  moodEntriesThisWeek: z.number().default(0),
  reflectionsWritten: z.number().default(0),
  streakDays: z.number().default(0),
  dataSize: z.string().default("0 KB"),
  commandCount: z.number().default(0),
  uptime: z.string().default("0m")
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  app2.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(validatedTask);
      res.json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: "Failed to create task" });
    }
  });
  app2.patch("/api/tasks/:id", async (req, res) => {
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
  app2.get("/api/moods", async (req, res) => {
    try {
      const moods = await storage.getMoods();
      res.json(moods);
    } catch (error) {
      console.error("Error fetching moods:", error);
      res.status(500).json({ error: "Failed to fetch moods" });
    }
  });
  app2.post("/api/moods", async (req, res) => {
    try {
      const validatedMood = insertMoodSchema.parse(req.body);
      const newMood = await storage.createMood(validatedMood);
      res.json(newMood);
    } catch (error) {
      console.error("Error creating mood:", error);
      res.status(400).json({ error: "Failed to create mood" });
    }
  });
  app2.get("/api/reflections", async (req, res) => {
    try {
      const reflections = await storage.getReflections();
      res.json(reflections);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      res.status(500).json({ error: "Failed to fetch reflections" });
    }
  });
  app2.post("/api/reflections", async (req, res) => {
    try {
      const validatedReflection = insertReflectionSchema.parse(req.body);
      const newReflection = await storage.createReflection(validatedReflection);
      res.json(newReflection);
    } catch (error) {
      console.error("Error creating reflection:", error);
      res.status(400).json({ error: "Failed to create reflection" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
