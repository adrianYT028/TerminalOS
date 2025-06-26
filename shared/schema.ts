import { z } from "zod";
import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description').notNull(),
  completed: boolean('completed').default(false).notNull(),
  priority: text('priority', { enum: ['high', 'medium', 'low'] }).default('medium').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const insertTaskSchema = createInsertSchema(tasks);
export const taskSchema = createInsertSchema(tasks).required();

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Moods table
export const moods = pgTable('moods', {
  id: uuid('id').primaryKey().defaultRandom(),
  mood: text('mood', { enum: ['happy', 'neutral', 'sad', 'excited', 'tired', 'stressed'] }).notNull(),
  note: text('note'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const insertMoodSchema = createInsertSchema(moods);
export const moodSchema = createInsertSchema(moods).required();

export type Mood = typeof moods.$inferSelect;
export type InsertMood = typeof moods.$inferInsert;

// Reflections table
export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title'),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const insertReflectionSchema = createInsertSchema(reflections);
export const reflectionSchema = createInsertSchema(reflections).required();

export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = typeof reflections.$inferInsert;

// Command history table
export const commandHistory = pgTable('command_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  command: text('command').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  output: text('output'),
});

export const insertCommandHistorySchema = createInsertSchema(commandHistory);
export const commandHistorySchema = createInsertSchema(commandHistory).required();

export type CommandHistory = typeof commandHistory.$inferSelect;
export type InsertCommandHistory = typeof commandHistory.$inferInsert;

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
