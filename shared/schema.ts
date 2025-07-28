import { z } from "zod";

// Task schema
export const taskSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  description: z.string(),
  completed: z.boolean().default(false),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  createdAt: z.date().default(() => new Date()),
  completedAt: z.date().optional(),
});

export const insertTaskSchema = taskSchema.omit({ _id: true, id: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Mood schema
export const moodSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  mood: z.enum(['happy', 'neutral', 'sad', 'excited', 'tired', 'stressed']),
  note: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
});

export const insertMoodSchema = moodSchema.omit({ _id: true, id: true });

export type Mood = z.infer<typeof moodSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;

// Reflection schema
export const reflectionSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  timestamp: z.date().default(() => new Date()),
});

export const insertReflectionSchema = reflectionSchema.omit({ _id: true, id: true });

export type Reflection = z.infer<typeof reflectionSchema>;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;

// Command history schema
export const commandHistorySchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  command: z.string(),
  timestamp: z.date().default(() => new Date()),
  output: z.string().optional(),
});

export const insertCommandHistorySchema = commandHistorySchema.omit({ _id: true, id: true });

export type CommandHistory = z.infer<typeof commandHistorySchema>;
export type InsertCommandHistory = z.infer<typeof insertCommandHistorySchema>;

// System stats (keeping as Zod schema since it's computed, not stored)
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
