import { QuizEntity, QuizType } from '../../types/quiz';
import { AppState, EntitySelection } from '../../types/store';
import { selectEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.quiz;
}

export function getAutomatedQuizEntity(state: AppState): EntitySelection<QuizEntity> {
    return selectEntity(getLocalState(state).quiz, QuizType.AUTOMATED);
}

export function getCurrentIndex(state: AppState): number {
    return getLocalState(state).currentIndex;
}
