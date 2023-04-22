
export function timeToArrayIndex(time: string): number {
    const splittedTime = time.split(':');
    const hour = parseInt(splittedTime[0]) == 24 ? 0 : parseInt(splittedTime[0])
    const minute = (Math.round(parseInt(splittedTime[1]) / 10)) * 10

    const formattedTime = `${hour}:${minute}`

    const hours: string[] = []
    for (let hour = 0; hour < 24; hour++) {
        hours.push(`${hour}:00`)
        hours.push(`${hour}:10`)
        hours.push(`${hour}:20`)
        hours.push(`${hour}:30`)
        hours.push(`${hour}:40`)
        hours.push(`${hour}:50`)
    }
    return (hours.indexOf(formattedTime))
}