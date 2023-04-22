
export function intervalToDay(inicialDay: any, interval: number): string {
    const finalDay = new Date(inicialDay)
    finalDay.setDate(new Date(inicialDay).getDate() + interval)
    return finalDay.toLocaleDateString('en-US')
}
export function dayIntervalCounter(biggestDate: any, smallestDate: any): number {
    const date1 = new Date(biggestDate).getTime()
    const date2 = new Date(smallestDate).getTime()

    const diff = date1 - date2
    const date3 = (new Date(diff).getTime()) / (1000 * 60 * 60 * 24)

    return date3

}