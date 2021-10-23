import produce from 'immer';

import { QuizEntity, QuizType } from '../../types/quiz';
import { createEntityStore, saveEntityToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.QuizState = {
    quiz: createEntityStore(),
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
    }
}, initialState);

export default quizReducer;
