const maxBoxNumber = 10;
const maxDays = 30;
const leitnerMultiplier = 1.5;

const expectedTimePerOption = 6.0; // In seconds. This will need tweaking.
const incorrectAnswerPenaltyMultiplier = 1.25;

const skipConfidence = 9.0; // Delta if user skips question.

export interface Feedback {
    intervalLength: number,
    nextBoxNumber: number,
}

// When user sets custom interval, we adjust box number accordingly.
export function getFeedbackWithInterval(interval: number): Feedback {
    const nextBoxNumber = getBoxNumberFromInterval(interval);
    return { intervalLength: interval, nextBoxNumber: nextBoxNumber };
}

// When user answers a question, we use their statistics to predict the desired box number.
export function getFeedbackSet(timeTakenInSeconds: number, numOptions: number, numGuesses: number, currentBox: number): Feedback[] {
    return [-1, 0, 1].map(x => getFeedback(timeTakenInSeconds, numOptions, numGuesses, currentBox, x));
}

function getFeedback(timeTakenInSeconds: number, numOptions: number, numGuesses: number, currentBox: number, confidence: number): Feedback {
    if (confidence < 0) {
        return { intervalLength: 1, nextBoxNumber: 0 };
    }
    const delta = getDelta(timeTakenInSeconds, numOptions, numGuesses);
    const nextBox = getNextBoxNumber(currentBox, delta) + confidence;
    const intervalLength = getIntervalFromBoxNumber(getNextBoxNumberUnfloored(currentBox, delta) + confidence);
    return { intervalLength: intervalLength, nextBoxNumber: nextBox };
}

function getNextBoxNumber(currentBox: number, delta: number): number {
    return Math.floor(getNextBoxNumberUnfloored(currentBox, delta));
}

function getNextBoxNumberUnfloored(currentBox: number, delta: number): number {
    return Math.max(0, Math.min(maxBoxNumber, Math.floor(Math.pow(Math.max(0, Math.pow(currentBox, 2) + delta), 0.5))));
}

function getBoxNumberFromInterval(interval: number) {
    return Math.floor(Math.log(interval) / Math.log(leitnerMultiplier));
}

function getDelta(timeTakenInSeconds: number, numOptions: number, numGuesses: number) {
    // Default value for when user skips question.
    if (numGuesses == 0) {
        return skipConfidence;
    }
    // Else, use metrics.
    const actualTime = timeTakenInSeconds * Math.pow(incorrectAnswerPenaltyMultiplier, numGuesses - numOptions);
    const expectedTime = expectedTimePerOption * numOptions;
    const timeRatio = expectedTime / actualTime - actualTime / expectedTime;
    return Math.sign(timeRatio) * Math.floor(Math.pow(Math.abs(timeRatio), 0.5) * 10);
}

function getIntervalFromBoxNumber(box: number): number {
    return Math.min(maxDays, Math.round(Math.pow(leitnerMultiplier, box)));
}
