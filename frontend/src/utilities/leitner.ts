const maxBoxNumber = 10;
const maxDays = 30;
const leitnerMultiplier = 1.5;

const expectedTimePerOption = 5.0; // In seconds. This will need tweaking.
const incorrectAnswerPenaltyMultiplier = 1.1;

export interface Feedback {
    intervalLength: number,
    nextBoxNumber: number,
}

export function getFeedback(timeTakenInSeconds: number, numOptions: number, numGuesses: number, currentBox: number): Feedback {
    const delta = getDelta(timeTakenInSeconds, numOptions, numGuesses);
    const nextBox = getNextBoxNumber(currentBox, delta);
    const intervalLength = getNextIntervalLength(currentBox, delta);
    return { intervalLength: intervalLength, nextBoxNumber: nextBox };
}

function getNextBoxNumber(currentBox: number, delta: number): number {
    return Math.floor(getNextBoxNumberUnfloored(currentBox, delta));
}

function getNextBoxNumberUnfloored(currentBox: number, delta: number): number {
    return Math.min(maxBoxNumber, Math.floor(Math.pow(Math.pow(currentBox, 2) + delta, 0.5)));
}

function getDelta(timeTakenInSeconds: number, numOptions: number, numGuesses: number) {
    const actualTime = timeTakenInSeconds * Math.pow(incorrectAnswerPenaltyMultiplier, numGuesses - numOptions);
    const expectedTime = expectedTimePerOption * numOptions;
    const timeRatio = expectedTime / actualTime - 1;
    return Math.floor(Math.pow(timeRatio, 0.5) * 10);
}

function getNextIntervalLength(currentBox: number, delta: number): number {
    return getIntervalFromBoxNumber(getNextBoxNumberUnfloored(currentBox, delta));
}

function getIntervalFromBoxNumber(box: number): number {
    return Math.min(maxDays, Math.round(Math.pow(leitnerMultiplier, box)));
}
