import { QuizData } from '../../types/quiz';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';

export function setAutomatedQuiz(quiz: QuizData): Operation<void> {
    return async (dispatch) => {
        batched(dispatch, saveAutomatedQuiz(quiz), actions.resetCurrentIndex());
    };
}

export function resetAutomatedQuiz(): Operation<void> {
    return async (dispatch) => {
        batched(dispatch, actions.resetAutomatedQuiz(), actions.resetCurrentIndex());
    };
}

export function incrementCurrentIndex(): Operation<void> {
    return async (dispatch) => {
        batched(dispatch, actions.incrementCurrentIndex());
    };
}

export function saveAutomatedQuiz(data: QuizData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveAutomatedQuiz(data));
    };
}
