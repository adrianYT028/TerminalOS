import { CommandOutput } from './command-output';
import { CommandInput } from './command-input';
import { useTerminal } from '@/hooks/use-terminal';

export function TerminalWindow() {
  const {
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
    commandCount,
    terminalRef
  } = useTerminal();

  const handleInputChange = (value: string) => {
    getSuggestions(value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-terminal-chrome rounded-lg shadow-2xl border border-terminal-border overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-terminal-chrome border-b border-terminal-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-terminal-muted text-sm font-medium">LifeOS Terminal v1.0.0</div>
        <div className="text-terminal-muted text-xs">
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="bg-terminal-bg h-[600px] flex flex-col">
        {/* Welcome Banner */}
        <div className="p-6 border-b border-terminal-border/30">
          <div className="text-terminal-blue text-lg font-semibold mb-2">
            ╭─────────────────────────────────────────────────────────╮
          </div>
          <div className="text-terminal-blue text-lg font-semibold mb-2">
            │  🚀 Welcome to LifeOS - Your Personal Terminal OS      │
          </div>
          <div className="text-terminal-blue text-lg font-semibold mb-2">
            ╰─────────────────────────────────────────────────────────╯
          </div>
          <div className="text-terminal-muted text-sm mt-4">
            Type <span className="text-terminal-blue font-semibold">help</span> to see available commands or start managing your productivity!
          </div>
        </div>

        {/* Terminal Output Area */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto terminal-scroll p-4 space-y-2"
        >
          {terminalHistory.map((entry) => (
            <CommandOutput key={entry.id} entry={entry} />
          ))}
        </div>

        {/* Command Input Area */}
        <CommandInput
          onExecuteCommand={executeCommand}
          onInputChange={handleInputChange}
          onHistoryNavigate={getHistoryCommand}
          onResetHistory={resetHistoryIndex}
          suggestions={suggestions}
          onClearSuggestions={clearSuggestions}
        />
      </div>

      {/* Terminal Footer */}
      <div className="bg-terminal-chrome border-t border-terminal-border px-4 py-2 flex items-center justify-between text-xs text-terminal-muted">
        <div className="flex items-center space-x-4">
          <span>Storage: <span className="text-terminal-green">{getStorageSize()}</span></span>
          <span>Commands: <span className="text-terminal-blue">{commandCount}</span></span>
          <span>Uptime: <span className="text-terminal-purple">{getUptime()}</span></span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-terminal-green">●</span>
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}
