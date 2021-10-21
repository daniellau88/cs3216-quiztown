import { CollectionListData, CollectionMiniEntity } from '../../types/collections';
import { CollectionDelta, EntityCollection, EntityStore } from '../../types/store';

// Action Names

export const SAVE_COLLECTION_LIST = 'collections/SAVE_COLLECTION_LIST';
export const SAVE_COLLECTION = 'collections/SAVE_COLLECTION';
export const UPDATE_COLLECTION_LIST = 'collections/UPDATE_COLLECTION_LIST';
export const ADD_COLLECTION = 'collections/ADD_COLLECTION';
export const EDIT_COLLECTION = 'collections/EDIT_COLLECTION';
export const DELETE_COLLECTION = 'collections/DELETE_COLLECTION';

// Action Types

export interface SaveCollectionListAction {
    type: typeof SAVE_COLLECTION_LIST;
    list: CollectionListData[];
}

export interface SaveCollectionAction {
    type: typeof SAVE_COLLECTION;
    data: CollectionListData;
}

export interface UpdateCollectionListAction {
    type: typeof UPDATE_COLLECTION_LIST;
    delta: CollectionDelta;
}

export interface AddCollectionAction {
    type: typeof ADD_COLLECTION;
    id: number;
}

export interface EditCollectionAction {
    type: typeof EDIT_COLLECTION;
}

export interface DeleteCollectionAction {
    type: typeof DELETE_COLLECTION;
    id: number;
}

export type CollectionsActionTypes =
    SaveCollectionListAction |
    SaveCollectionAction |
    UpdateCollectionListAction |
    AddCollectionAction |
    EditCollectionAction |
    DeleteCollectionAction;

// State Types
export interface CollectionsState {
    allCollections: EntityCollection;
    collections: EntityStore<CollectionMiniEntity, CollectionMiniEntity>;
}
