export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function formatUptime(startTime: Date): string {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

export function sanitizeCommand(command: string): string {
  return command.trim().replace(/\s+/g, ' ');
}

export function highlightCommand(command: string): string {
  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);
  
  return `<span class="text-terminal-green">${cmd}</span> ${args.join(' ')}`;
}
