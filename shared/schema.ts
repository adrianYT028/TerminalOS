import { z } from "zod";

// Task schema
export const taskSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  completed: z.boolean().default(false),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  createdAt: z.string(),
  completedAt: z.string().optional(),
});

export const insertTaskSchema = taskSchema.omit({ id: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Mood schema
export const moodSchema = z.object({
  id: z.string(),
  mood: z.enum(['happy', 'neutral', 'sad', 'excited', 'tired', 'stressed']),
  note: z.string().optional(),
  timestamp: z.string(),
});

export const insertMoodSchema = moodSchema.omit({ id: true, timestamp: true });

export type Mood = z.infer<typeof moodSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;

// Reflection schema
export const reflectionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().min(1),
  timestamp: z.string(),
});

export const insertReflectionSchema = reflectionSchema.omit({ id: true, timestamp: true });

export type Reflection = z.infer<typeof reflectionSchema>;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;

// Command history schema
export const commandHistorySchema = z.object({
  id: z.string(),
  command: z.string(),
  timestamp: z.string(),
  output: z.string().optional(),
});

export type CommandHistory = z.infer<typeof commandHistorySchema>;

// System stats schema
export const systemStatsSchema = z.object({
  tasksCompletedToday: z.number().default(0),
  pendingTasks: z.number().default(0),
  moodEntriesThisWeek: z.number().default(0),
  reflectionsWritten: z.number().default(0),
  streakDays: z.number().default(0),
  dataSize: z.string().default('0 KB'),
  commandCount: z.number().default(0),
  uptime: z.string().default('0m'),
});

export type SystemStats = z.infer<typeof systemStatsSchema>;
