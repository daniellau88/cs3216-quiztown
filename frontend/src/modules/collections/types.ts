import { CollectionListData, CollectionMiniEntity, TagData } from '../../types/collections';
import { CollectionDelta, EntityCollection, EntityStore } from '../../types/store';

// Action Names

export const SAVE_COLLECTION_LIST = 'collections/SAVE_COLLECTION_LIST';
export const SAVE_COLLECTION = 'collections/SAVE_COLLECTION';
export const ADD_COLLECTION = 'collections/ADD_COLLECTION';
export const EDIT_COLLECTION = 'collections/EDIT_COLLECTION';
export const DELETE_COLLECTION = 'collections/DELETE_COLLECTION';
export const UPDATE_PERSONAL_COLLECTION_LIST = 'collections/UPDATE_PERSONAL_COLLECTION_LIST';
export const UPDATE_PUBLIC_COLLECTION_LIST = 'collections/UPDATE_PUBLIC_COLLECTION_LIST';
export const LOAD_TAGS = 'collections/LOAD_TAGS';
export const RESET_COLLECTION = 'collections/RESET_COLLECTION';

// Action Types

export interface SaveCollectionListAction {
    type: typeof SAVE_COLLECTION_LIST;
    list: CollectionListData[];
}

export interface SaveCollectionAction {
    type: typeof SAVE_COLLECTION;
    data: CollectionListData;
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

export interface UpdatePersonalCollectionListAction {
    type: typeof UPDATE_PERSONAL_COLLECTION_LIST;
    delta: CollectionDelta;
}

export interface UpdatePublicCollectionListAction {
    type: typeof UPDATE_PUBLIC_COLLECTION_LIST;
    delta: CollectionDelta;
}

export interface LoadTagsAction {
    type: typeof LOAD_TAGS;
    data: TagData[];
}

export interface ResetCollectionAction {
    type: typeof RESET_COLLECTION;
    id: number;
}

export type CollectionsActionTypes =
    SaveCollectionListAction |
    SaveCollectionAction |
    AddCollectionAction |
    EditCollectionAction |
    DeleteCollectionAction |
    UpdatePersonalCollectionListAction |
    UpdatePublicCollectionListAction |
    LoadTagsAction |
    ResetCollectionAction;

// State Types
export interface CollectionsState {
    // Note: allCollections will store all personal collections
    allPersonalCollections: EntityCollection;
    collections: EntityStore<CollectionMiniEntity, CollectionMiniEntity>;
    allPublicCollections: EntityCollection;
    allTags: TagData[];
}
