export function formatDuration(duration?: boolean[]) {
  if (!duration) return;
  return `${Math.floor(duration.length / 6)}h ${(duration.length % 6) * 10}m`;
}
