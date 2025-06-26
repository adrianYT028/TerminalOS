import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useCommandParser } from './use-command-parser';
import { Task, Mood, Reflection } from '@shared/schema';
import { formatUptime, getCurrentTime } from '@/utils/terminal-formatter';
import { useQuery } from '@tanstack/react-query';

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export function useTerminal() {
  const [commandHistory, setCommandHistory] = useLocalStorage<string[]>('lifeos-history', []);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [startTime] = useState(new Date());
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalRef = useRef<HTMLDivElement>(null);

  // Fetch data from database
  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json() as Promise<Task[]>;
    }
  });

  const { data: moods = [], refetch: refetchMoods } = useQuery({
    queryKey: ['/api/moods'],
    queryFn: async () => {
      const response = await fetch('/api/moods');
      if (!response.ok) throw new Error('Failed to fetch moods');
      return response.json() as Promise<Mood[]>;
    }
  });

  const { data: reflections = [], refetch: refetchReflections } = useQuery({
    queryKey: ['/api/reflections'],
    queryFn: async () => {
      const response = await fetch('/api/reflections');
      if (!response.ok) throw new Error('Failed to fetch reflections');
      return response.json() as Promise<Reflection[]>;
    }
  });

  const refreshData = async () => {
    await Promise.all([
      refetchTasks(),
      refetchMoods(),
      refetchReflections()
    ]);
  };

  const context = {
    tasks,
    moods,
    reflections,
    history: commandHistory,
    refreshData,
    setHistory: setCommandHistory
  };

  const { parseCommand, getSuggestions, clearSuggestions, suggestions } = useCommandParser(context);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const executeCommand = async (command: string) => {
    const result = await parseCommand(command);
    
    if (result?.clear) {
      setTerminalHistory([]);
      return;
    }

    if (result) {
      const entry: TerminalEntry = {
        id: Date.now().toString(),
        command,
        output: result.output,
        timestamp: new Date().toISOString(),
        success: result.success
      };

      setTerminalHistory(prev => [...prev, entry]);
    }
  };

  const getHistoryCommand = (direction: 'up' | 'down'): string | null => {
    if (commandHistory.length === 0) return null;

    let newIndex: number;
    
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);
    }

    setHistoryIndex(newIndex);
    return newIndex === -1 ? '' : commandHistory[newIndex];
  };

  const resetHistoryIndex = () => {
    setHistoryIndex(-1);
  };

  const getUptime = () => formatUptime(startTime);

  const getStorageSize = () => {
    const data = { tasks, moods, reflections, history: commandHistory };
    const sizeInBytes = JSON.stringify(data).length;
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  };

  return {
    terminalHistory,
    executeCommand,
    getSuggestions,
    clearSuggestions,
    suggestions,
    getHistoryCommand,
    resetHistoryIndex,
    currentTime,
    getUptime,
    getStorageSize,
    commandCount: commandHistory.length,
    terminalRef,
    tasks,
    moods,
    reflections
  };
}
