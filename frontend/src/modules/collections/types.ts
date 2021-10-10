import { CollectionData, CollectionListData, CollectionMiniEntity, CollectionsCardData, CollectionsCardEntity, CollectionsCardListData, CollectionsCardMiniEntity } from '../../types/collections';
import { CollectionDelta, EntityCollection, EntityCollectionSet, EntityStore } from '../../types/store';

// Action Names

export const SAVE_COLLECTION_LIST = 'collections/SAVE_COLLECTION_LIST';
export const SAVE_COLLECTION = 'collections/SAVE_COLLECTION';
export const UPDATE_COLLECTION_LIST = 'collections/UPDATE_COLLECTION_LIST';
export const ADD_COLLECTION = 'collections/ADD_COLLECTION';
export const EDIT_COLLECTION = 'collections/EDIT_COLLECTION';
export const DELETE_COLLECTION = 'collections/DELETE_COLLECTION';

export const SAVE_COLLECTIONS_CARD_LIST = 'collections/SAVE_COLLECTIONS_CARD_LIST';
export const UPDATE_COLLECTIONS_CARD_LIST = 'collections/UPDATE_COLLECTIONS_CARD_LIST';
export const SAVE_COLLECTIONS_CARD = 'collections/SAVE_COLLECTIONS_CARD';
export const ADD_COLLECTIONS_CARD = 'collections/ADD_COLLECTIONS_CARD';
export const EDIT_COLLECTIONS_CARD = 'collections/EDIT_COLLECTIONS_CARD';
export const DELETE_COLLECTIONS_CARD = 'collections/DELETE_COLLECTIONS_CARD';

// Action Types

export interface SaveCollectionListAction {
    type: typeof SAVE_COLLECTION_LIST;
    list: CollectionListData[];
}

export interface SaveCollectionAction {
    type: typeof SAVE_COLLECTION;
    data: CollectionData;
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

export interface SaveCollectionsCardListAction {
    type: typeof SAVE_COLLECTIONS_CARD_LIST;
    list: CollectionsCardListData[];
}

export interface UpdateCollectionsCardListAction {
    type: typeof UPDATE_COLLECTIONS_CARD_LIST;
    collectionId: number;
    delta: CollectionDelta;
}

export interface SaveCollectionsCardAction {
    type: typeof SAVE_COLLECTIONS_CARD;
    data: CollectionsCardData;
}

export interface AddCollectionsCardAction {
    type: typeof ADD_COLLECTIONS_CARD;
    collectionId: number;
    cardId: number;
}

export interface EditCollectionsCardAction {
    type: typeof EDIT_COLLECTIONS_CARD;
    cardId: number;
}

export interface DeleteCollectionsCardAction {
    type: typeof DELETE_COLLECTIONS_CARD;
    collectionId: number;
    cardId: number;
}

export type CollectionsActionTypes =
    SaveCollectionListAction |
    SaveCollectionAction |
    UpdateCollectionListAction |
    AddCollectionAction |
    EditCollectionAction |
    DeleteCollectionAction |
    SaveCollectionsCardListAction |
    UpdateCollectionsCardListAction |
    SaveCollectionsCardAction |
    AddCollectionsCardAction |
    EditCollectionsCardAction |
    DeleteCollectionsCardAction;

// State Types
export interface CollectionsState {
    allCollections: EntityCollection;
    collections: EntityStore<CollectionMiniEntity, CollectionMiniEntity>;

    collectionCollectionsCards: EntityCollectionSet;
    collectionsCards: EntityStore<CollectionsCardMiniEntity, CollectionsCardEntity>;
}
