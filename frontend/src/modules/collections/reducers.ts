import produce from 'immer';

import { createEntityCollection, createEntityStore, removeFromStore, resetCollectionCache, saveDeltaToCollection, saveEntityToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.CollectionsState = {
    collections: createEntityStore(),
    allCollections: createEntityCollection(),
};

const collectionsReducer = produce((draft: types.CollectionsState, action: types.CollectionsActionTypes) => {
    switch (action.type) {
        case types.SAVE_COLLECTION: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.collections, entity);
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
    }
}, initialState);

export default collectionsReducer;
