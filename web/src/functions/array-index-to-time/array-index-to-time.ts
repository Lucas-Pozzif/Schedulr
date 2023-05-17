
export function arrayIndexToTime(index: number): string {
    const hours: string[] = []
    for (let hour = 0; hour <= 24; hour++) {
        hours.push(`${hour}:00`)
        hours.push(`${hour}:10`)
        hours.push(`${hour}:20`)
        hours.push(`${hour}:30`)
        hours.push(`${hour}:40`)
        hours.push(`${hour}:50`)
    }
    return (hours[index])
}