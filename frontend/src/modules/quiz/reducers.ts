import produce from 'immer';

import { QuizEntity, QuizType } from '../../types/quiz';
import { createEntityStore, removeFromStore, saveEntityToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.QuizState = {
    quiz: createEntityStore(),
    currentIndex: 0,
};

const quizReducer = produce((draft: types.QuizState, action: types.QuizActionTypes) => {
    switch (action.type) {
        case types.SAVE_AUTOMATED_QUIZ: {
            const data: QuizEntity = {
                ...action.data,
                id: QuizType.AUTOMATED,
            };
            saveEntityToStore(draft.quiz, data);
            return;
        }
        case types.RESET_AUTOMATED_QUIZ: {
            removeFromStore(draft.quiz, QuizType.AUTOMATED);
            return;
        }
        case types.INCREMENT_CURRENT_INDEX: {
            draft.currentIndex = draft.currentIndex + 1;
            return;
        }
        case types.RESET_CURRENT_INDEX: {
            draft.currentIndex = 0;
            return;
        }
    }
}, initialState);

export default quizReducer;
