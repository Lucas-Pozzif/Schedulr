
export function durationArrayToString(duration: boolean[]) {
    const lastTrueIndex = duration.lastIndexOf(true);
    const trueDuration = duration.slice(0, lastTrueIndex + 1);
    const stateTrueDurationArray = []

    return `${10 * (trueDuration.length)} min`

}