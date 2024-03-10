export function parseDate(dateString: string) {
    const parts = dateString.split("/");
    const year = parseInt(parts[2], 10) + 2000; // Assuming years are in the range 00-99
    const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date
    const day = parseInt(parts[0], 10);

    return new Date(year, month, day);
}