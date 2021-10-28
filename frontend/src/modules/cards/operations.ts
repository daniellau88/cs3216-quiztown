import Moment from 'moment';

import api from '../../api';
import * as collections from '../../modules/collections';
import { ApiResponse } from '../../types';
import { CardData, CardEntity, CardListData, CardPostData } from '../../types/cards';
import { CollectionsImportTextPostData } from '../../types/collections';
import { CollectionOptions, EntityCollection, NormalizeOperation, Operation } from '../../types/store';
import { dateToISOFormat } from '../../utilities/datetime';
import { batched, queryEntityCollection, queryEntityCollectionSet, withCachedEntity } from '../../utilities/store';
import { getCurrentUser } from '../auth/selectors';

import * as actions from './actions';
import { getCardEntity, getCardMiniEntity, getCollectionCardList, getStarredCards } from './selectors';

export function loadStarredCards(options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        const user = getCurrentUser(getState());
        const starredCardFilter: any = {
            flagged: 1,
            is_reviewed: 1,
            owner_id: user ? user.user_id : -1,
        };

        return queryEntityCollection(
            () => getStarredCards(getState()),
            { ...options, filters: { ...options.filters, ...starredCardFilter } },
            async (params) => {
                const response = await api.cards.getCardList(params);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateStarredCardList(delta)),
        );
    };
}

export function saveCardList(list: CardListData[]): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCardList(list));
    };
}


export function loadCard(cardId: number): Operation<ApiResponse<CardEntity>> {
    return async (dispatch, getState) => {
        return withCachedEntity(getState, getCardEntity, cardId, async () => {
            const response = await api.cards.getCard(cardId);
            batched(dispatch, saveCard(response.payload.item));
            return response;
        });
    };
}

export function addCard(card: CardPostData): Operation<ApiResponse<CardEntity>> {
    return async (dispatch, getState) => {
        const response = await api.cards.addCard(card);
        const data = response.payload.item;
        batched(dispatch, saveCard(data), actions.addCard(data.id, data.collection_id), collections.operations.resetCollection(card.collection_id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCardEntity(getState(), data.id)! };
    };
}

export function saveCard(data: CardData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCard(data));
    };
}

export function updateCard(cardId: number, card: Partial<CardPostData>): Operation<ApiResponse<CardEntity>> {
    return async (dispatch, getState) => {
        const response = await api.cards.patchCard(cardId, card);
        const data = response.payload.item;
        batched(dispatch, saveCard(data), actions.editCard(cardId));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCardEntity(getState(), data.id)! };
    };
}

export function deleteCard(cardId: number): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.cards.deleteCard(cardId);
        const card = getCardMiniEntity(getState(), cardId);
        const resetCollectionAction = [];
        if (card != null) {
            resetCollectionAction.push(collections.operations.resetCollection(card.collection_id));
        }
        batched(dispatch, discardCard(cardId), ...resetCollectionAction);
        return response;
    };
}

export function discardCard(cardId: number): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.deleteCard(cardId));
    };
}

export function loadCollectionCards(collectionId: number, options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        const collectionCardFilter: any = {
            collection_id: collectionId,
        };

        return queryEntityCollectionSet(
            () => getState().cards.collectionCards,
            collectionId,
            { ...options, filters: { ...options.filters, ...collectionCardFilter } },
            async (params) => {
                const response = await api.cards.getCardList(params);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionCardList(collectionId, delta)),
        );
    };
}

export function loadCollectionImportCards(collectionImportId: number): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        const importCardsFilter: any = {
            collection_import_id: collectionImportId,
        };

        return queryEntityCollectionSet(
            () => getState().cards.importCards,
            collectionImportId,
            { filters: importCardsFilter },
            async (params) => {
                const response = await api.cards.getCardList(params);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionImportCardList(collectionImportId, delta)),
        );
    };
}

export function loadUndoneCards(): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        const user = getCurrentUser(getState());
        const undoneCardFilter: any = {
            next_date: {
                end: dateToISOFormat(Moment().add(7, 'days').toDate()),
            },
            is_reviewed: 1,
            owner_id: user ? user.user_id : -1,
        };

        return queryEntityCollection(
            () => getState().cards.undoneCards,
            { filters: undoneCardFilter },
            async (params) => {
                const response = await api.cards.getCardList(params);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateUndoneCardList(delta)),
        );
    };
}

export function importTextCards(collectionId: number, cardTextImport: CollectionsImportTextPostData): Operation<ApiResponse<EntityCollection>> {
    return async (dispatch, getState) => {
        const response = await api.collections.importTextCollectionCards(collectionId, cardTextImport);
        const data = response.payload.items;
        const batchedAdd = data.map(x => actions.addCard(x.id, x.collection_id));
        batched(dispatch, saveCardList(data), ...batchedAdd, collections.operations.resetCollection(collectionId));
        return { ...response, payload: getCollectionCardList(getState(), collectionId) };
    };
}

export function resetCollectionCards(collectionId: number): Operation<void> {
    return async (dispatch, getState) => {
        batched(dispatch, actions.resetCollectionCardList(collectionId));
    };
}
