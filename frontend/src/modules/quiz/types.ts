import { QuizData, QuizEntity, QuizMiniEntity } from '../../types/quiz';
import { EntityStore } from '../../types/store';

// Action Names

export const SAVE_AUTOMATED_QUIZ = 'quiz/SAVE_AUTOMATED_QUIZ';
export const RESET_AUTOMATED_QUIZ = 'quiz/RESET_AUTOMATED_QUIZ';
export const INCREMENT_CURRENT_INDEX = 'quiz/INCREMENT_CURRENT_INDEX';
export const RESET_CURRENT_INDEX = 'quiz/RESET_CURRENT_INDEX';

// Action Types
export interface SaveAutomatedQuizAction {
    type: typeof SAVE_AUTOMATED_QUIZ;
    data: QuizData;
}

export interface ResetAutomatedQuizAction {
    type: typeof RESET_AUTOMATED_QUIZ;
}
export interface IncrementCurrentIndexAction {
    type: typeof INCREMENT_CURRENT_INDEX;
}

export interface ResetCurrentIndexAction {
    type: typeof RESET_CURRENT_INDEX;
}

export type QuizActionTypes =
    SaveAutomatedQuizAction |
    ResetAutomatedQuizAction |
    IncrementCurrentIndexAction |
    ResetCurrentIndexAction;

// State Types
export interface QuizState {
    quiz: EntityStore<QuizMiniEntity, QuizEntity>;
    currentIndex: number;
}
