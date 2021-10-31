import produce from 'immer';

import { createEntityCollection, createEntityStore, removeFromStore, resetCollectionCache, resetEntityCache, saveDeltaToCollection, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CollectionsState = {
    collections: createEntityStore(),
    allPersonalCollections: createEntityCollection({
        sortBy: 'updated_at',
        sortOrder: 'desc',
    }),
    allPublicCollections: createEntityCollection({
        sortBy: 'updated_at',
        sortOrder: 'desc',
    }),
    allTags: [],
};

const collectionsReducer = produce((draft: types.CollectionsState, action: types.CollectionsActionTypes) => {
    switch (action.type) {
        case types.SAVE_COLLECTION_LIST: {
            const list = action.list.map((data) => ({
                ...data,
            }));
            // Collection has no simplified entity
            list.forEach(item => {
                saveEntityToStore(draft.collections, item);
            });
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
        case types.UPDATE_PERSONAL_COLLECTION_LIST: {
            saveDeltaToCollection(draft.allPersonalCollections, action.delta);
            return;
        }
        case types.ADD_COLLECTION: {
            draft.allPersonalCollections.ids.push(action.id);
            resetCollectionCache(draft.allPersonalCollections);
            resetCollectionCache(draft.allPublicCollections);
            return;
        }
        case types.EDIT_COLLECTION: {
            resetCollectionCache(draft.allPersonalCollections);
            resetCollectionCache(draft.allPublicCollections);
            return;
        }
        case types.DELETE_COLLECTION: {
            removeFromStore(draft.collections, action.id);
            const collections = draft.allPersonalCollections;
            if (collections) {
                collections.ids = collections.ids.filter((id) => id !== action.id);
            }
            resetCollectionCache(draft.allPersonalCollections);
            resetCollectionCache(draft.allPublicCollections);
            return;
        }
        case types.UPDATE_PUBLIC_COLLECTION_LIST: {
            saveDeltaToCollection(draft.allPublicCollections, action.delta);
            return;
        }
        case types.LOAD_TAGS: {
            draft.allTags = action.data;
            return;
        }
        case types.RESET_COLLECTION: {
            resetEntityCache(draft.collections, action.id);
            // Needed for card count, mot very efficient, can remove if too frequent refreshing
            resetCollectionCache(draft.allPersonalCollections);
            return;
        }
    }
}, initialState);

export default collectionsReducer;
