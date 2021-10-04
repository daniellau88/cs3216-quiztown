import produce from 'immer';
import { createEntityStore, createEntityCollection, saveEntityToStore } from '../../utilities/store';
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
    }
}, initialState);

export default collectionsReducer;
