import mongoose from "./db";
// MongoDB Models
const TaskModel = mongoose.model('Task', new mongoose.Schema({
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
}));
const MoodModel = mongoose.model('Mood', new mongoose.Schema({
    mood: { type: String, enum: ['happy', 'neutral', 'sad', 'excited', 'tired', 'stressed'], required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now }
}));
const ReflectionModel = mongoose.model('Reflection', new mongoose.Schema({
    title: { type: String },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}));
const CommandHistoryModel = mongoose.model('CommandHistory', new mongoose.Schema({
    command: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    output: { type: String }
}));
export class DatabaseStorage {
    // Task methods
    async getTasks() {
        const tasks = await TaskModel.find().sort({ createdAt: -1 });
        return tasks.map(task => ({
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
        if (!updatedTask)
            return undefined;
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
        return moods.map(mood => ({
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
        return reflections.map(reflection => ({
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
        return commands.map(cmd => ({
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
}
export const storage = new DatabaseStorage();
