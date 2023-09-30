
export function dayIntervalCounter(biggestDate: any, smallestDate: any):number {
    const date1 = new Date(biggestDate).getTime()
    const date2 = new Date(smallestDate).getTime()

    const diff = date1 - date2
    const date3 = Math.round((new Date(diff).getTime()) / (1000 * 60 * 60 * 24))

    return date3

}