import api from '../../api';
import { ApiResponse } from '../../types';
import { CardData, CardMiniEntity, CardPostData } from '../../types/cards';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';
import { getCardMiniEntity } from './selectors';

export function addCard(card: CardPostData): Operation<ApiResponse<CardMiniEntity>> {
    return async (dispatch, getState) => {
        const response = await api.cards.addCard(card);
        const data = response.payload.card;
        batched(dispatch, saveCard(data), actions.addCard(data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCardMiniEntity(getState(), data.id)! };
    };
}

export function saveCard(data: CardData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCard(data));
    };
}

export function updateCard(id: number, card: CardPostData): Operation<ApiResponse<CardMiniEntity>> {
    return async (dispatch, getState) => {
        const response = await api.cards.patchCard(id, card);
        const data = response.payload.card;
        batched(dispatch, saveCard(data), actions.editCard());
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCardMiniEntity(getState(), data.id)! };
    };
}

export function deleteCard(id: number): Operation<ApiResponse<{}>> {
    return async (dispatch) => {
        const response = await api.cards.deleteCard(id);
        batched(dispatch, discardCard(id));
        return response;
    };
}

export function discardCard(id: number): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.deleteCard(id));
    };
}
