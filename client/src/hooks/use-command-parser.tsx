import { useState, useCallback } from 'react';
import { executeCommand, CommandContext, AVAILABLE_COMMANDS } from '@/utils/commands';

export function useCommandParser(context: CommandContext) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const parseCommand = useCallback(async (command: string) => {
    const sanitized = command.trim();
    if (!sanitized) return null;

    // Add command to history
    context.setHistory(prev => [...prev, sanitized]);

    // Execute command
    return await executeCommand(sanitized, context);
  }, [context]);

  const getSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = AVAILABLE_COMMANDS.filter(cmd => 
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );
    
    setSuggestions(filtered);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    parseCommand,
    getSuggestions,
    clearSuggestions,
    suggestions
  };
}
