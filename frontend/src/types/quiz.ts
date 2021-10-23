export enum QuizType {
    AUTOMATED = 1,
}

export type QuizData = {
    cardIds: number[],
}

export type QuizMiniEntity = {
    id: number,
    cardIds: number[],
}


export type QuizEntity = {
    id: number,
    cardIds: number[],
}
