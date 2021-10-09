import produce from 'immer';

import { createEntityCollection, createEntityCollectionSet, createEntityStore, removeFromStore, resetCollectionCache, resetEntityCache, saveDeltaToCollection, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CollectionsState = {
    collections: createEntityStore(),
    allCollections: createEntityCollection(),
    collectionCollectionsCards: createEntityCollectionSet(),
    collectionsCards: createEntityStore(),
};

const collectionsReducer = produce((draft: types.CollectionsState, action: types.CollectionsActionTypes) => {
    switch (action.type) {
        case types.SAVE_COLLECTION_LIST: {
            const list = action.list.map((data) => ({
                ...data,
            }));
            saveListToStore(draft.collections, list);
            return;
        }
        case types.SAVE_COLLECTION: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.collections, entity);
            return;
        }
        case types.UPDATE_COLLECTION_LIST: {
            saveDeltaToCollection(draft.allCollections, action.delta);
            return;
        }
        case types.ADD_COLLECTION: {
            draft.allCollections.ids.push(action.id);
            return;
        }
        case types.EDIT_COLLECTION: {
            resetCollectionCache(draft.allCollections);
            return;
        }
        case types.DELETE_COLLECTION: {
            removeFromStore(draft.collections, action.id);
            resetCollectionCache(draft.allCollections);
            return;
        }
        case types.SAVE_COLLECTIONS_CARD: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.collectionsCards, entity);
            return;
        }
        case types.ADD_COLLECTIONS_CARD: {
            const collectionCollectionsCards = draft.collectionCollectionsCards.byId[action.collectionId];
            if (collectionCollectionsCards && !collectionCollectionsCards.ids.includes(action.cardId)) {
                collectionCollectionsCards.ids.push(action.cardId);
            }
            return;
        }
        case types.EDIT_COLLECTIONS_CARD: {
            resetEntityCache(draft.collectionsCards, action.cardId);
            return;
        }
        case types.DELETE_COLLECTIONS_CARD: {
            removeFromStore(draft.collectionsCards, action.cardId);
            const collectionCollectionsCards = draft.collectionCollectionsCards.byId[action.collectionId];
            if (collectionCollectionsCards) {
                collectionCollectionsCards.ids = collectionCollectionsCards.ids.filter((id: number) => id !== action.cardId);
            }
            return;
        }
    }
}, initialState);

export default collectionsReducer;
