import { QuizData } from '../../types/quiz';

import * as types from './types';

export function saveAutomatedQuiz(data: QuizData): types.SaveAutomatedQuizAction {
    return {
        type: types.SAVE_AUTOMATED_QUIZ,
        data,
    };
}
