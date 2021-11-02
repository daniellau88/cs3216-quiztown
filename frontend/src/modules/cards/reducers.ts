import produce from 'immer';

import { createEntityCollection, createEntityCollectionSet, createEntityStore, removeFromStore, resetCollectionCache, resetCollectionSetCache, resetEntityCache, saveDeltaToCollection, saveDeltaToCollectionSet, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CardsState = {
    cards: createEntityStore(),
    starredCards: createEntityCollection({
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
    importCards: createEntityCollectionSet(),
    undoneCards: createEntityCollection(),
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
        case types.SAVE_CARD: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.cards, entity);
            return;
        }
        case types.ADD_CARD: {
            if (draft.collectionCards && draft.collectionCards.byId[action.collection_id]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                draft.collectionCards.byId[action.collection_id]!.ids.push(action.id);
            }
            resetCollectionSetCache(draft.collectionCards, action.collection_id);
            return;
        }
        case types.EDIT_CARD: {
            return;
        }
        case types.DELETE_CARD: {
            const collectionId = draft.cards.byId[action.id]?.collection_id;
            removeFromStore(draft.cards, action.id);
            if (collectionId && draft.collectionCards && draft.collectionCards.byId[collectionId]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                draft.collectionCards.byId[collectionId]!.ids = draft.collectionCards.byId[collectionId]!.ids.filter((id) => id !== action.id);
            }
            if (collectionId) {
                resetCollectionSetCache(draft.collectionCards, collectionId);
            }
            return;
        }
        case types.UPDATE_STARRED_CARD_LIST: {
            saveDeltaToCollection(draft.starredCards, action.delta);
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
        case types.RESET_UNDONE_CARD_LIST: {
            resetCollectionCache(draft.undoneCards);
            return;
        }
    }
}, initialState);

export default cardsReducer;
