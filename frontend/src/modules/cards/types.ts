import { CardData, CardMiniEntity } from '../../types/cards';
import { EntityCollection, EntityStore } from '../../types/store';

// Action Names

export const SAVE_CARD = 'cards/SAVE_CARD';
export const ADD_CARD = 'cards/ADD_CARD';
export const EDIT_CARD = 'cards/EDIT_CARD';
export const DELETE_CARD = 'cards/DELETE_CARD';

// Action Types

export interface SaveCardAction {
    type: typeof SAVE_CARD;
    data: CardData;
}

export interface AddCardAction {
    type: typeof ADD_CARD;
    id: number;
}

export interface EditCardAction {
    type: typeof EDIT_CARD;
}

export interface DeleteCardAction {
    type: typeof DELETE_CARD;
    id: number;
}

export type CardsActionTypes =
    SaveCardAction |
    AddCardAction |
    EditCardAction |
    DeleteCardAction;

// State Types
export interface CardsState {
    allCards: EntityCollection;
    cards: EntityStore<CardMiniEntity, CardEntity>;
}
