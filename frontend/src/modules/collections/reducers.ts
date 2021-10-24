import produce from 'immer';

import { createEntityCollection, createEntityStore, removeFromStore, resetCollectionCache, saveDeltaToCollection, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CollectionsState = {
    collections: createEntityStore(),
    allCollections: createEntityCollection({
        sortBy: 'updated_at',
        sortOrder: 'desc',
    }),
    allPublicCollections: createEntityCollection({
        sortBy: 'updated_at',
        sortOrder: 'desc',
    }),
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
            const collections = draft.allCollections;
            if (collections) {
                collections.ids = collections.ids.filter((id) => id !== action.id);
            }
            resetCollectionCache(draft.allCollections);
            return;
        }
        case types.UPDATE_PUBLIC_COLLECTION_LIST: {
            saveDeltaToCollection(draft.allPublicCollections, action.delta);
            return;
        }
    }
}, initialState);

export default collectionsReducer;
