import { CollectionData, CollectionEntity, CollectionMiniEntity } from '../../types/collections';
import { EntityCollection, EntityStore } from '../../types/store';

// Action Names

export const SAVE_COLLECTION = 'collections/SAVE_COLLECTION';
export const ADD_COLLECTION = 'collections/ADD_COLLECTION';

// Action Types

export interface SaveCollectionAction {
    type: typeof SAVE_COLLECTION;
    data: CollectionData;
}

export interface AddCollectionAction {
    type: typeof ADD_COLLECTION;
    id: number;
}

export type CollectionsActionTypes = SaveCollectionAction | AddCollectionAction;

// State Types
export interface CollectionsState {
    allCollections: EntityCollection;
    collections: EntityStore<CollectionMiniEntity, CollectionEntity>;
}
