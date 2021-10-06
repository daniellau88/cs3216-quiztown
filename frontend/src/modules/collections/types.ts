import { CollectionData, CollectionEntity } from '../../types/collections';
import { EntityCollection, EntityStore } from '../../types/store';

// Action Names

export const SAVE_COLLECTION = 'collections/SAVE_COLLECTION';
export const ADD_COLLECTION = 'collections/ADD_COLLECTION';
export const EDIT_COLLECTION = 'collections/EDIT_COLLECTION';
export const DELETE_COLLECTION = 'collections/DELETE_COLLECTION';

// Action Types

export interface SaveCollectionAction {
    type: typeof SAVE_COLLECTION;
    data: CollectionData;
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
    SaveCollectionAction |
    AddCollectionAction |
    EditCollectionAction |
    DeleteCollectionAction;

// State Types
export interface CollectionsState {
    allCollections: EntityCollection;
    collections: EntityStore<CollectionEntity, CollectionEntity>;
}
