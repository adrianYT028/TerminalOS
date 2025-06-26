import { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface CommandInputProps {
  onExecuteCommand: (command: string) => void;
  onInputChange: (value: string) => void;
  onHistoryNavigate: (direction: 'up' | 'down') => string | null;
  onResetHistory: () => void;
  suggestions: string[];
  onClearSuggestions: () => void;
}

export function CommandInput({
  onExecuteCommand,
  onInputChange,
  onHistoryNavigate,
  onResetHistory,
  suggestions,
  onClearSuggestions
}: CommandInputProps) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value.trim()) {
        onExecuteCommand(value.trim());
        setValue('');
        onResetHistory();
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommand = onHistoryNavigate('up');
      if (historyCommand !== null) {
        setValue(historyCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const historyCommand = onHistoryNavigate('down');
      if (historyCommand !== null) {
        setValue(historyCommand);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setValue(suggestions[0]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      onClearSuggestions();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onInputChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="border-t border-terminal-border/30 p-4">
      <div className="flex items-center space-x-2">
        <span className="text-terminal-green">➜</span>
        <span className="text-terminal-blue">lifeos</span>
        <span className="text-terminal-muted">~</span>
        <span className="text-terminal-purple">$</span>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="bg-transparent border-none outline-none text-terminal-text font-mono w-full pl-2"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />
          <span className="absolute right-0 top-0 w-2 h-5 bg-terminal-blue animate-cursor-blink"></span>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-2 text-xs text-terminal-muted">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <span
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-terminal-chrome px-2 py-1 rounded text-terminal-blue cursor-pointer hover:bg-terminal-border/50 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
