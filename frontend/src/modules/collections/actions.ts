import { CollectionData, CollectionListData, CollectionsCardData, CollectionsCardListData } from '../../types/collections';
import { CollectionDelta } from '../../types/store';

import * as types from './types';

export function saveCollectionList(list: CollectionListData[]): types.SaveCollectionListAction {
    return {
        type: types.SAVE_COLLECTION_LIST,
        list,
    };
}

export function saveCollection(data: CollectionData): types.SaveCollectionAction {
    return {
        type: types.SAVE_COLLECTION,
        data,
    };
}

export function updateCollectionList(delta: CollectionDelta): types.UpdateCollectionListAction {
    return {
        type: types.UPDATE_COLLECTION_LIST,
        delta,
    };
}

export function addCollection(id: number): types.AddCollectionAction {
    return {
        type: types.ADD_COLLECTION,
        id,
    };
}

export function editCollection(): types.EditCollectionAction {
    return {
        type: types.EDIT_COLLECTION,
    };
}

export function deleteCollection(id: number): types.DeleteCollectionAction {
    return {
        type: types.DELETE_COLLECTION,
        id: id,
    };
}

export function saveCollectionsCardList(list: CollectionsCardListData[]): types.SaveCollectionsCardListAction{
    return {
        type: types.SAVE_COLLECTIONS_CARD_LIST,
        list,
    };
}

export function updateCollectionsCardList(delta: CollectionDelta, collectionId: number): types.UpdateCollectionsCardListAction {
    return {
        type: types.UPDATE_COLLECTIONS_CARD_LIST,
        collectionId,
        delta,
    };
}

export function saveCollectionsCard(data: CollectionsCardData): types.SaveCollectionsCardAction {
    return {
        type: types.SAVE_COLLECTIONS_CARD,
        data,
    };
}

export function addCollectionsCard(collectionId: number, cardId: number): types.AddCollectionsCardAction {
    return {
        type: types.ADD_COLLECTIONS_CARD,
        collectionId,
        cardId,
    };
}

export function editCollectionsCard(cardId: number): types.EditCollectionsCardAction {
    return {
        type: types.EDIT_COLLECTIONS_CARD,
        cardId,
    };
}

export function deleteCollectionsCard(collectionId: number, cardId: number): types.DeleteCollectionsCardAction {
    return {
        type: types.DELETE_COLLECTIONS_CARD,
        collectionId: collectionId,
        cardId: cardId,
    };
}
