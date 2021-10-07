import produce from 'immer';

import { createEntityCollection, createEntityStore, removeFromStore, resetCollectionCache, saveDeltaToCollection, saveEntityToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CardsState = {
    cards: createEntityStore(),
    allCards: createEntityCollection(),
};

const collectionsReducer = produce((draft: types.CardsState, action: types.CardsActionTypes) => {
    switch (action.type) {
        case types.SAVE_CARD: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.cards, entity);
            return;
        }
        case types.ADD_CARD: {
            draft.allCards.ids.push(action.id);
            return;
        }
        case types.EDIT_CARD: {
            resetCollectionCache(draft.allCards);
            return;
        }
        case types.DELETE_CARD: {
            removeFromStore(draft.cards, action.id);
            resetCollectionCache(draft.allCards);
            return;
        }
    }
}, initialState);

export default collectionsReducer;
