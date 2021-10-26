import { CardData, CardEntity, CardListData, CardMiniEntity } from '../../types/cards';
import { CollectionDelta, EntityCollection, EntityCollectionSet, EntityStore } from '../../types/store';

// Action Names

export const SAVE_CARD_LIST = 'cards/SAVE_CARD_LIST';
export const SAVE_CARD = 'cards/SAVE_CARD';
export const UPDATE_CARD_LIST = 'cards/UPDATE_CARD_LIST';
export const ADD_CARD = 'cards/ADD_CARD';
export const EDIT_CARD = 'cards/EDIT_CARD';
export const DELETE_CARD = 'cards/DELETE_CARD';
export const UPDATE_COLLECTION_CARD_LIST = 'cards/UPDATE_COLLECTION_CARD_LIST';
export const UPDATE_COLLECTION_IMPORT_CARD_LIST = 'cards/UPDATE_COLLECTION_IMPORT_CARD_LIST';
export const RESET_COLLECTION_CARD_LIST = 'cards/RESET_COLLECTION_CARD_LIST';

// Action Types

export interface SaveCardListAction {
    type: typeof SAVE_CARD_LIST;
    list: CardListData[];
}

export interface SaveCardAction {
    type: typeof SAVE_CARD;
    data: CardData;
}

export interface UpdateCardListAction {
    type: typeof UPDATE_CARD_LIST;
    delta: CollectionDelta;
}

export interface AddCardAction {
    type: typeof ADD_CARD;
    id: number;
    collection_id: number;
}

export interface EditCardAction {
    type: typeof EDIT_CARD;
    id: number;
}

export interface DeleteCardAction {
    type: typeof DELETE_CARD;
    id: number;
}

export interface UpdateCollectionCardListAction {
    type: typeof UPDATE_COLLECTION_CARD_LIST;
    collectionId: number;
    delta: CollectionDelta;
}

export interface UpdateCollectionImportCardListAction {
    type: typeof UPDATE_COLLECTION_IMPORT_CARD_LIST;
    collectionImportId: number;
    delta: CollectionDelta;
}

export interface ResetCollectionCardListAction {
    type: typeof RESET_COLLECTION_CARD_LIST;
    collectionId: number;
}

export type CardsActionTypes =
    SaveCardListAction |
    SaveCardAction |
    UpdateCardListAction |
    AddCardAction |
    EditCardAction |
    DeleteCardAction |
    UpdateCollectionCardListAction |
    UpdateCollectionImportCardListAction |
    ResetCollectionCardListAction;

// State Types
export interface CardsState {
    allCards: EntityCollection;
    cards: EntityStore<CardMiniEntity, CardEntity>;
    collectionCards: EntityCollectionSet;
    importCards: EntityCollectionSet;
}
