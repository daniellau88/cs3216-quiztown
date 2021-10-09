import { CardData } from '../../types/cards';

import * as types from './types';

export function saveCard(data: CardData): types.SaveCardAction {
    return {
        type: types.SAVE_CARD,
        data,
    };
}

export function addCard(id: number): types.AddCardAction {
    return {
        type: types.ADD_CARD,
        id,
    };
}

export function editCard(): types.EditCardAction {
    return {
        type: types.EDIT_CARD,
    };
}

export function deleteCard(id: number): types.DeleteCardAction {
    return {
        type: types.DELETE_CARD,
        id: id,
    };
}
