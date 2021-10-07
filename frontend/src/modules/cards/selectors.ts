import { CardEntity } from '../../types/cards';
import { AppState, EntityCollection, EntitySelection, SelectionKey } from '../../types/store';
import { selectEntity } from '../../utilities/store';

function getLocalState(state: AppState) {
    return state.cards;
}

export function getAllCards(state: AppState): EntityCollection {
    return getLocalState(state).allCards;
}

export function getCardEntity(state: AppState, id: SelectionKey): EntitySelection<CardEntity> {
    return selectEntity(getLocalState(state).cards, id);
}
