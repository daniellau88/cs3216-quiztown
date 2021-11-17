const maxBoxNumber = 10;
const maxDays = 30;
const leitnerMultiplier = 1.37;

const expectedTimePerOption = 6.0; // In seconds. This will need tweaking.
const incorrectAnswerPenaltyMultiplier = 1.25;

const expectedSkipTimePerOption = 3.0; // Comparison time for skipped questions.
const expectedTextCardTime = 10.0;

export interface Feedback {
    intervalLength: number,
    nextBoxNumber: number,
}

// When user answers a question, we use their statistics to predict the desired box number.
export function getFeedbackSet(timeTakenInSeconds: number, numOptions: number, numGuesses: number, numWrongGuesses: number, currentBox: number): Feedback[] {
    return [-1, 0, 1].map(x => getFeedback(timeTakenInSeconds, numOptions, numGuesses, numWrongGuesses, currentBox, x));
}

function getFeedback(timeTakenInSeconds: number, numOptions: number, numGuesses: number, numWrongGuesses: number, currentBox: number, confidence: number): Feedback {
    if (confidence < 0) {
        return { intervalLength: 1, nextBoxNumber: 0 };
    }
    const delta = getDelta(timeTakenInSeconds, numOptions, numGuesses, numWrongGuesses);
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

function getDelta(timeTakenInSeconds: number, numOptions: number, numGuesses: number, numWrongGuesses: number) {
    // Different handling for text card.
    if (numOptions == 0) {
        const timeRatio = expectedTextCardTime / timeTakenInSeconds - timeTakenInSeconds / expectedTextCardTime;
        return getDeltaFromTimeRatio(timeRatio);
    }
    // Different calculation based on whether user skipped options.
    const numAnswered = numGuesses - numWrongGuesses;
    const numSkipped = numOptions - numAnswered;
    const actualTime = timeTakenInSeconds * Math.pow(incorrectAnswerPenaltyMultiplier, numWrongGuesses);
    const expectedTime = expectedSkipTimePerOption * numSkipped + expectedTimePerOption * numOptions;
    const timeRatio = expectedTime / actualTime - actualTime / expectedTime;
    return getDeltaFromTimeRatio(timeRatio);
}

function getDeltaFromTimeRatio(timeRatio: number) {
    return Math.sign(timeRatio) * Math.floor(Math.pow(Math.abs(timeRatio), 0.5) * 10);
}

function getIntervalFromBoxNumber(box: number): number {
    return Math.min(maxDays, Math.round(Math.pow(leitnerMultiplier, box)));
}
