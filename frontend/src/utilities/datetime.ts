import moment from 'moment';

export function roundDownDay(date: Date): Date {
    const p = 24 * 60 * 60 * 1000; // milliseconds in a day
    return new Date(Math.floor(date.getTime() / p) * p);
}

export function addDays(date: Date, days: number): Date {
    const p = 24 * 60 * 60 * 1000; // milliseconds in a day
    return new Date(Math.floor(date.getTime() + days * p));
}

export function dateToISOFormat(date: Date): string {
    const offset = date.getTimezoneOffset();
    const isoDate = new Date(date.getTime() - (offset * 60 * 1000));
    return isoDate.toISOString().split('T')[0];
}

export function epochTimeToDate(epochTime: number): Date {
    const d = new Date(0);
    d.setUTCSeconds(epochTime);
    return d;
}

export function dateToTimeSinceText(date: Date): string {
    return moment(date).fromNow(true) + ' ago';
}
