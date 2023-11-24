export function formatDuration(duration: boolean[]) {
    return `${Math.floor(duration.length / 6)}h ${(duration.length % 6) * 10}m`
}