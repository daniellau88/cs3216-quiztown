export function roundDownDay(date: Date): Date {
    const p = 24 * 60 * 60 * 1000; // milliseconds in a day
    return new Date(Math.floor(date.getTime() / p) * p);
}
