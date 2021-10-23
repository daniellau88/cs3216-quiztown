import { QuizData, QuizEntity, QuizMiniEntity } from '../../types/quiz';
import { EntityStore } from '../../types/store';

// Action Names

export const SAVE_AUTOMATED_QUIZ = 'quiz/SAVE_AUTOMATED_QUIZ';

// Action Types

export interface SaveAutomatedQuizAction {
    type: typeof SAVE_AUTOMATED_QUIZ;
    data: QuizData;
}

export type QuizActionTypes =
    SaveAutomatedQuizAction;

// State Types
export interface QuizState {
    quiz: EntityStore<QuizMiniEntity, QuizEntity>;
}
