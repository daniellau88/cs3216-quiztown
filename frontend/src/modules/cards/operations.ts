import api from '../../api';
import { ApiResponse } from '../../types';
import { CardData, CardEntity, CardListData, CardPostData } from '../../types/cards';
import { CollectionsImportTextPostData } from '../../types/collections';
import { CollectionOptions, EntityCollection, NormalizeOperation, Operation } from '../../types/store';
import { batched, queryEntityCollection, queryEntityCollectionSet, withCachedEntity } from '../../utilities/store';

import * as actions from './actions';
import { getAllCards, getCardEntity, getCollectionCardList } from './selectors';

export function loadAllCards(options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        return queryEntityCollection(
            () => getAllCards(getState()),
            options,
            async (params) => {
                const response = await api.cards.getCardList(params);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCardList(delta)),
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
        batched(dispatch, saveCard(data), actions.addCard(data.id, data.collection_id));
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
    return async (dispatch) => {
        const response = await api.cards.deleteCard(cardId);
        // TODO: delete from cards list
        batched(dispatch, discardCard(cardId));
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
        return queryEntityCollectionSet(
            () => getState().cards.collectionCards,
            collectionId,
            options,
            async (params) => {
                const newParams = {
                    ...params,
                    filters: {
                        ...params.filters,
                        collection_id: collectionId,
                    },
                };

                const response = await api.cards.getCardList(newParams);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionCardList(collectionId, delta)),
        );
    };
}

export function loadCollectionImportCards(collectionImportId: number, options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        return queryEntityCollectionSet(
            () => getState().cards.importCards,
            collectionImportId,
            options,
            async (params) => {
                const newParams = {
                    ...params,
                    filters: {
                        ...params.filters,
                        collection_import_id: collectionImportId,
                    },
                };

                const response = await api.cards.getCardList(newParams);
                const data = response.payload.items;
                batched(dispatch, saveCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionImportCardList(collectionImportId, delta)),
        );
    };
}

export function importTextCards(collectionId: number, cardTextImport: CollectionsImportTextPostData): Operation<ApiResponse<EntityCollection>> {
    return async (dispatch, getState) => {
        const response = await api.collections.importTextCollectionCards(collectionId, cardTextImport);
        const data = response.payload.items;
        const batchedAdd = data.map(x => actions.addCard(x.id, x.collection_id));
        batched(dispatch, saveCardList(data), ...batchedAdd);
        return { ...response, payload: getCollectionCardList(getState(), collectionId) };
    };
}
