import { Task, Mood, Reflection, SystemStats } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export interface CommandContext {
  tasks: Task[];
  moods: Mood[];
  reflections: Reflection[];
  history: string[];
  refreshData: () => Promise<void>;
  setHistory: (history: string[] | ((prev: string[]) => string[])) => void;
}

export interface CommandResult {
  output: string;
  success: boolean;
  clear?: boolean;
}

export interface AsyncCommandResult extends Promise<CommandResult> {}

const MOOD_EMOJIS = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  excited: '🤩',
  tired: '😴',
  stressed: '😰'
};

export const AVAILABLE_COMMANDS = [
  'help',
  'add-task',
  'list-tasks',
  'complete-task',
  'log-mood',
  'reflect',
  'list-reflections',
  'history',
  'clear',
  'status'
];

export async function executeCommand(command: string, context: CommandContext): Promise<CommandResult> {
  const parts = command.trim().split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      return handleHelp();
    
    case 'add-task':
      return await handleAddTask(args.join(' '), context);
    
    case 'list-tasks':
      return handleListTasks(context);
    
    case 'complete-task':
      return await handleCompleteTask(args[0], context);
    
    case 'log-mood':
      return await handleLogMood(args, context);
    
    case 'reflect':
      return await handleReflect(args.join(' '), context);
    
    case 'list-reflections':
      return handleListReflections(context);
    
    case 'history':
      return handleHistory(context);
    
    case 'clear':
      return { output: '', success: true, clear: true };
    
    case 'status':
      return handleStatus(context);
    
    default:
      return {
        output: `Command not found: ${cmd}. Type 'help' to see available commands.`,
        success: false
      };
  }
}

function handleHelp(): CommandResult {
  const helpText = `
📋 Available Commands:

help                    Show this help message
add-task <description>  Add a new task
list-tasks             Show all tasks
complete-task <id>     Mark a task as completed
log-mood <mood> [note] Record your mood (happy, neutral, sad, excited, tired, stressed)
reflect <content>      Write a reflection or journal entry
list-reflections       Show all reflections
history                Show command history
clear                  Clear the terminal
status                 Show system status

Examples:
  add-task "Review project proposal"
  log-mood happy "Had a great day!"
  reflect "Today I learned something new about React hooks"
`;
  
  return { output: helpText, success: true };
}

async function handleAddTask(description: string, context: CommandContext): Promise<CommandResult> {
  if (!description.trim()) {
    return { output: 'Error: Task description is required. Usage: add-task <description>', success: false };
  }

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: description.trim(),
        priority: 'medium'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    await context.refreshData();
    return { output: `✅ Task added successfully: "${description}"`, success: true };
  } catch (error) {
    console.error('Error adding task:', error);
    return { output: 'Error: Failed to add task. Please try again.', success: false };
  }
}

function handleListTasks(context: CommandContext): CommandResult {
  if (context.tasks.length === 0) {
    return { output: 'No tasks found. Use "add-task <description>" to create your first task.', success: true };
  }

  let output = '📝 Your Tasks:\n\n';
  
  context.tasks.forEach((task, index) => {
    const status = task.completed ? '✓' : '○';
    const statusColor = task.completed ? 'completed' : 'pending';
    const description = task.completed ? `${task.description} (completed)` : task.description;
    
    output += `${index + 1}. [${status}] ${description}\n`;
  });

  const completedCount = context.tasks.filter(t => t.completed).length;
  const pendingCount = context.tasks.length - completedCount;
  
  output += `\nTotal: ${context.tasks.length} tasks | Completed: ${completedCount} | Pending: ${pendingCount}`;
  
  return { output, success: true };
}

async function handleCompleteTask(taskId: string, context: CommandContext): Promise<CommandResult> {
  const taskIndex = parseInt(taskId) - 1;
  
  if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= context.tasks.length) {
    return { output: 'Error: Invalid task ID. Use "list-tasks" to see task IDs.', success: false };
  }

  const task = context.tasks[taskIndex];
  
  if (task.completed) {
    return { output: `Task "${task.description}" is already completed.`, success: false };
  }

  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: true,
        completedAt: new Date()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }

    await context.refreshData();
    return { output: `✅ Task completed: "${task.description}"`, success: true };
  } catch (error) {
    console.error('Error completing task:', error);
    return { output: 'Error: Failed to complete task. Please try again.', success: false };
  }
}

async function handleLogMood(args: string[], context: CommandContext): Promise<CommandResult> {
  if (args.length === 0) {
    return { 
      output: 'Error: Mood is required. Usage: log-mood <mood> [note]\nAvailable moods: happy, neutral, sad, excited, tired, stressed', 
      success: false 
    };
  }

  const mood = args[0].toLowerCase() as keyof typeof MOOD_EMOJIS;
  const note = args.slice(1).join(' ');

  if (!MOOD_EMOJIS[mood]) {
    return { 
      output: 'Error: Invalid mood. Available moods: happy, neutral, sad, excited, tired, stressed', 
      success: false 
    };
  }

  try {
    const response = await fetch('/api/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood,
        note: note || null
      })
    });

    if (!response.ok) {
      throw new Error('Failed to log mood');
    }

    await context.refreshData();

    let output = '✅ Mood logged successfully!\n\n';
    output += `Mood: ${MOOD_EMOJIS[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}\n`;
    if (note) {
      output += `Note: "${note}"\n`;
    }
    output += `Time: ${new Date().toLocaleString()}`;

    return { output, success: true };
  } catch (error) {
    console.error('Error logging mood:', error);
    return { output: 'Error: Failed to log mood. Please try again.', success: false };
  }
}

async function handleReflect(content: string, context: CommandContext): Promise<CommandResult> {
  if (!content.trim()) {
    return { output: 'Error: Reflection content is required. Usage: reflect <content>', success: false };
  }

  try {
    const response = await fetch('/api/reflections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content.trim()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save reflection');
    }

    await context.refreshData();
    return { output: `✅ Reflection saved successfully!\n\n"${content}"\n\nTime: ${new Date().toLocaleString()}`, success: true };
  } catch (error) {
    console.error('Error saving reflection:', error);
    return { output: 'Error: Failed to save reflection. Please try again.', success: false };
  }
}

function handleListReflections(context: CommandContext): CommandResult {
  if (context.reflections.length === 0) {
    return { output: 'No reflections found. Use "reflect <content>" to write your first reflection.', success: true };
  }

  let output = '📝 Your Reflections:\n\n';
  
  context.reflections.slice(-5).forEach((reflection, index) => {
    const date = new Date(reflection.timestamp).toLocaleDateString();
    output += `${index + 1}. ${date}: "${reflection.content}"\n\n`;
  });

  if (context.reflections.length > 5) {
    output += `... and ${context.reflections.length - 5} more reflections`;
  }

  return { output, success: true };
}

function handleHistory(context: CommandContext): CommandResult {
  if (context.history.length === 0) {
    return { output: 'No command history found.', success: true };
  }

  let output = '📋 Command History:\n\n';
  
  context.history.slice(-10).forEach((cmd, index) => {
    output += `${index + 1}. ${cmd}\n`;
  });

  if (context.history.length > 10) {
    output += `\n... and ${context.history.length - 10} more commands`;
  }

  return { output, success: true };
}

function handleStatus(context: CommandContext): CommandResult {
  const today = new Date().toDateString();
  const tasksCompletedToday = context.tasks.filter(t => 
    t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
  ).length;
  
  const pendingTasks = context.tasks.filter(t => !t.completed).length;
  
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const moodEntriesThisWeek = context.moods.filter(m => 
    new Date(m.timestamp) > thisWeek
  ).length;

  const dataSize = calculateDataSize(context);

  let output = '📊 System Status:\n\n';
  output += `Tasks Completed Today: ${tasksCompletedToday}\n`;
  output += `Pending Tasks: ${pendingTasks}\n`;
  output += `Mood Entries This Week: ${moodEntriesThisWeek}\n`;
  output += `Reflections Written: ${context.reflections.length}\n`;
  output += `Total Commands: ${context.history.length}\n`;
  output += `Data Size: ${dataSize}\n`;

  return { output, success: true };
}

function calculateDataSize(context: CommandContext): string {
  const data = {
    tasks: context.tasks,
    moods: context.moods,
    reflections: context.reflections,
    history: context.history
  };
  
  const sizeInBytes = JSON.stringify(data).length;
  const sizeInKB = (sizeInBytes / 1024).toFixed(1);
  
  return `${sizeInKB} KB`;
}
