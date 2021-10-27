import { CardData, CardListData } from '../../types/cards';
import { CollectionDelta } from '../../types/store';

import * as types from './types';

export function saveCardList(list: CardListData[]): types.SaveCardListAction {
    return {
        type: types.SAVE_CARD_LIST,
        list,
    };
}

export function saveCard(data: CardData): types.SaveCardAction {
    return {
        type: types.SAVE_CARD,
        data,
    };
}

export function addCard(id: number, collection_id: number): types.AddCardAction {
    return {
        type: types.ADD_CARD,
        id,
        collection_id,
    };
}

export function editCard(id: number): types.EditCardAction {
    return {
        type: types.EDIT_CARD,
        id,
    };
}

export function deleteCard(id: number): types.DeleteCardAction {
    return {
        type: types.DELETE_CARD,
        id,
    };
}

export function updateStarredCardList(delta: CollectionDelta): types.UpdateStarredCardListAction {
    return {
        type: types.UPDATE_STARRED_CARD_LIST,
        delta,
    };
}

export function updateCollectionCardList(collectionId: number, delta: CollectionDelta): types.UpdateCollectionCardListAction {
    return {
        type: types.UPDATE_COLLECTION_CARD_LIST,
        collectionId,
        delta,
    };
}

export function updateCollectionImportCardList(collectionImportId: number, delta: CollectionDelta): types.UpdateCollectionImportCardListAction {
    return {
        type: types.UPDATE_COLLECTION_IMPORT_CARD_LIST,
        collectionImportId,
        delta,
    };
}

export function updateUndoneCardList(delta: CollectionDelta): types.UpdateUndoneCardListAction {
    return {
        type: types.UPDATE_UNDONE_CARD_LIST,
        delta,
    };
}

export function resetCollectionCardList(collectionId: number): types.ResetCollectionCardListAction {
    return {
        type: types.RESET_COLLECTION_CARD_LIST,
        collectionId,
    };
}
