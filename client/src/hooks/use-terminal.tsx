import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useCommandParser } from './use-command-parser';
import { Task, Mood, Reflection } from '@shared/schema';
import { formatUptime, getCurrentTime } from '@/utils/terminal-formatter';

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export function useTerminal() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeos-tasks', []);
  const [moods, setMoods] = useLocalStorage<Mood[]>('lifeos-moods', []);
  const [reflections, setReflections] = useLocalStorage<Reflection[]>('lifeos-reflections', []);
  const [commandHistory, setCommandHistory] = useLocalStorage<string[]>('lifeos-history', []);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [startTime] = useState(new Date());
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalRef = useRef<HTMLDivElement>(null);

  const context = {
    tasks,
    moods,
    reflections,
    history: commandHistory,
    setTasks,
    setMoods,
    setReflections,
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

  const executeCommand = (command: string) => {
    const result = parseCommand(command);
    
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
