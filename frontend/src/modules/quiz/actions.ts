import { QuizData } from '../../types/quiz';

import * as types from './types';

export function saveAutomatedQuiz(data: QuizData): types.SaveAutomatedQuizAction {
    return {
        type: types.SAVE_AUTOMATED_QUIZ,
        data,
    };
}

export function resetAutomatedQuiz(): types.ResetAutomatedQuizAction {
    return {
        type: types.RESET_AUTOMATED_QUIZ,
    };
}

export function incrementCurrentIndex(): types.IncrementCurrentIndexAction {
    return {
        type: types.INCREMENT_CURRENT_INDEX,
    };
}

export function resetCurrentIndex(): types.ResetCurrentIndexAction {
    return {
        type: types.RESET_CURRENT_INDEX,
    };
}
