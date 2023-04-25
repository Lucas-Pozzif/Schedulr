
export function dateArrayGenerator(arrayLength: number): Date[] {
    const today = new Date();

    const dates = [];

    for (let i = 0; i < arrayLength; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    return dates
}