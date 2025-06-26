import { TerminalWindow } from '@/components/terminal/terminal-window';

export default function Terminal() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-mono">
      <TerminalWindow />
    </div>
  );
}
