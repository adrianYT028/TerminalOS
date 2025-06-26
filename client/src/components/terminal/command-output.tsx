import { TerminalEntry } from '@/hooks/use-terminal';

interface CommandOutputProps {
  entry: TerminalEntry;
}

export function CommandOutput({ entry }: CommandOutputProps) {
  return (
    <div className="group mb-4">
      <div className="flex items-center space-x-2 text-terminal-text">
        <span className="text-terminal-green">➜</span>
        <span className="text-terminal-blue">lifeos</span>
        <span className="text-terminal-muted">~</span>
        <span className="text-terminal-purple">$</span>
        <span>{entry.command}</span>
      </div>
      {entry.output && (
        <div className="ml-6 mt-2 text-terminal-text">
          <div className={`bg-terminal-chrome/30 rounded-md p-4 border border-terminal-border/50 ${
            !entry.success ? 'border-terminal-red/50' : ''
          }`}>
            <pre className="whitespace-pre-wrap font-mono text-sm">{entry.output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
