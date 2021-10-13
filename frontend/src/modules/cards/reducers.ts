import produce from 'immer';

import { createEntityCollection, createEntityCollectionSet, createEntityStore, removeFromStore, resetCollectionCache, resetCollectionSetCache, resetEntityCache, saveDeltaToCollection, saveDeltaToCollectionSet, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CardsState = {
    cards: createEntityStore(),
    allCards: createEntityCollection(),
    collectionCards: createEntityCollectionSet(),
};

const cardsReducer = produce((draft: types.CardsState, action: types.CardsActionTypes) => {
    switch (action.type) {
        case types.SAVE_CARD_LIST: {
            const list = action.list.map((data) => ({
                ...data,
            }));
            saveListToStore(draft.cards, list);
            return;
        }
        case types.UPDATE_CARD_LIST: {
            saveDeltaToCollection(draft.allCards, action.delta);
            return;
        }
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
            resetCollectionCache(draft.allCards);
            return;
        }
        case types.EDIT_CARD: {
            resetCollectionCache(draft.allCards);
            return;
        }
        case types.DELETE_CARD: {
            const collectionId = draft.cards.byId[action.id]?.collection_id;
            removeFromStore(draft.cards, action.id);

            resetCollectionCache(draft.allCards);
            if (collectionId) {
                resetCollectionSetCache(draft.collectionCards, collectionId);
            }
            return;
        }
        case types.UPDATE_COLLECTION_CARD_LIST: {
            saveDeltaToCollectionSet(draft.collectionCards, action.collectionId, action.delta);
            return;
        }
    }
}, initialState);

export default cardsReducer;
