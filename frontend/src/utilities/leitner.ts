import { roundDownDay } from './datetime';

// TODO grab baseMultiplier and maxBoxNumber from user settings.
const baseMultiplier = 1.0;
const maxBoxNumber = 5;
const leitnerMultiplier = 3.0 * baseMultiplier;

// Confidence levels: 1 (set to box 0), 2 (currentBox remains the same), 3 (set to box currentBox + 0.5), 4 (set to currentBox + 1).
export function getIntervals(currentBox: number): number[] {
    return [1, 2, 3, 4].map(x => getNextBoxNumber(currentBox, x)).map(x => Math.round(Math.pow(leitnerMultiplier, x)));
}

export function getNextBoxNumber(currentBox: number, confidence: number): number {
    switch (confidence) {
        case 1:
            return 0;
        case 2:
            return currentBox;
        case 3:
            return Math.min(maxBoxNumber, currentBox + 0.5);
        case 4:
            return Math.min(maxBoxNumber, currentBox + 1.0);
    }
    return 1;
}

export function getNextIntervalEndDate(currentBox: number): Date {
    const date = new Date();
    return roundDownDay(new Date(date.setTime(date.getTime() + getIntervalFromBoxNumber(currentBox) * 86400000)));

}

export function getIntervalFromBoxNumber(currentBox: number): number {
    return Math.round(Math.pow(leitnerMultiplier, currentBox));
}

// To show user the max interval of their settings.
export function getMaxInterval(): number {
    return Math.pow(leitnerMultiplier, maxBoxNumber);
}
