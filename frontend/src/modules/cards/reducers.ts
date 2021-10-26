import produce from 'immer';

import { createEntityCollection, createEntityCollectionSet, createEntityStore, removeFromStore, resetCollectionCache, resetCollectionSetCache, resetEntityCache, saveDeltaToCollection, saveDeltaToCollectionSet, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CardsState = {
    cards: createEntityStore(),
    allCards: createEntityCollection({
        filters: {
            'is_reviewed': 1,
        },
    }),
    collectionCards: createEntityCollectionSet({
        filters: {
            'is_reviewed': 1,
        },
        sortBy: 'updated_at',
        sortOrder: 'desc',
    }),
    importCards: createEntityCollectionSet({
        filters: {
            'is_reviewed': 0,
        },
    }),
    undoneCards: createEntityCollection({
        filters: {
            'is_reviewed': 1,
        },
    }),
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
            if (draft.collectionCards && draft.collectionCards.byId[action.collection_id]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                draft.collectionCards.byId[action.collection_id]!.ids.push(action.id);
            }
            resetCollectionCache(draft.allCards);
            resetCollectionSetCache(draft.collectionCards, action.collection_id);
            return;
        }
        case types.EDIT_CARD: {
            resetCollectionCache(draft.allCards);
            return;
        }
        case types.DELETE_CARD: {
            const collectionId = draft.cards.byId[action.id]?.collection_id;
            removeFromStore(draft.cards, action.id);
            if (draft.allCards) {
                draft.allCards.ids = draft.allCards.ids.filter((id) => id !== action.id);
            }
            if (collectionId && draft.collectionCards && draft.collectionCards.byId[collectionId]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                draft.collectionCards.byId[collectionId]!.ids = draft.collectionCards.byId[collectionId]!.ids.filter((id) => id !== action.id);
            }
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
        case types.UPDATE_COLLECTION_IMPORT_CARD_LIST: {
            saveDeltaToCollectionSet(draft.importCards, action.collectionImportId, action.delta);
            return;
        }
        case types.UPDATE_UNDONE_CARD_LIST: {
            saveDeltaToCollection(draft.undoneCards, action.delta);
            return;
        }
        case types.RESET_COLLECTION_CARD_LIST: {
            resetCollectionSetCache(draft.collectionCards, action.collectionId);
            return;
        }
    }
}, initialState);

export default cardsReducer;
