import { tasks, moods, reflections, type Task, type Mood, type Reflection, type InsertTask, type InsertMood, type InsertReflection } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Task methods
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Mood methods
  getMoods(): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // Reflection methods
  getReflections(): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
}

export class DatabaseStorage implements IStorage {
  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Mood methods
  async getMoods(): Promise<Mood[]> {
    return await db.select().from(moods).orderBy(desc(moods.timestamp));
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const [newMood] = await db.insert(moods).values(mood).returning();
    return newMood;
  }

  // Reflection methods
  async getReflections(): Promise<Reflection[]> {
    return await db.select().from(reflections).orderBy(desc(reflections.timestamp));
  }

  async createReflection(reflection: InsertReflection): Promise<Reflection> {
    const [newReflection] = await db.insert(reflections).values(reflection).returning();
    return newReflection;
  }
}

export const storage = new DatabaseStorage();
