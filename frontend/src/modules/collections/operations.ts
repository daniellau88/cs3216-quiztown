import api from '../../api';
import { ApiResponse, CollectionQueryParams } from '../../types';
import { CollectionData, CollectionListData, CollectionMiniEntity, CollectionPostData, CollectionsCardData, CollectionsCardEntity, CollectionsCardImportPostData, CollectionsCardListData, CollectionsCardPostData } from '../../types/collections';
import { CollectionOptions, EntityCollection, NormalizeOperation, Operation } from '../../types/store';
import { batched, queryEntityCollection, queryEntityCollectionSet, withCachedEntity } from '../../utilities/store';

import * as actions from './actions';
import { getAllCollections, getCollectionMiniEntity, getCollectionsCardEntity } from './selectors';

export function loadAllCollections(options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        return queryEntityCollection(
            () => getAllCollections(getState()),
            options,
            async (params) => {
                const response = await api.collections.getCollectionList(params);
                const data: CollectionListData[] = response.payload.items;
                batched(dispatch, saveCollectionList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionList(delta)),
        );
    };
}

export function loadCollection(id: number): Operation<ApiResponse<CollectionMiniEntity>> {
    return (dispatch, getState) => {
        return withCachedEntity(getState, getCollectionMiniEntity, id, async () => {
            const response = await api.collections.getCollection(id);
            batched(dispatch, saveCollection(response.payload.item));
            return response;
        });
    };
}

export function addCollection(collection: CollectionPostData): Operation<ApiResponse<CollectionMiniEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.addCollection(collection);
        const data = response.payload.item;
        batched(dispatch, saveCollection(data), actions.addCollection(data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionMiniEntity(getState(), data.id)! };
    };
}

export function saveCollectionList(list: CollectionListData[]): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollectionList(list));
    };
}

export function saveCollection(data: CollectionData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollection(data));
    };
}

export function updateCollection(id: number, collection: CollectionPostData): Operation<ApiResponse<CollectionMiniEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.patchCollection(id, collection);
        const data = response.payload.item;
        batched(dispatch, saveCollection(data), actions.editCollection());
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionMiniEntity(getState(), data.id)! };
    };
}

export function deleteCollection(id: number): Operation<ApiResponse<{}>> {
    return async (dispatch) => {
        const response = await api.collections.deleteCollection(id);
        batched(dispatch, discardCollection(id));
        return response;
    };
}

export function discardCollection(id: number): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.deleteCollection(id));
    };
}

export function loadCollectionContents(collectionId: number, options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        return queryEntityCollectionSet(
            () => getState().collections.collectionCollectionsCards,
            collectionId,
            options,
            async (params) => {
                const response = await api.collections.getCollectionContentsList(collectionId, params);
                const data = response.payload.items;
                batched(dispatch, saveCollectionsCardList(data));
                return response;
            },
            (delta) => dispatch(actions.updateCollectionsCardList(delta, collectionId)),
        );
    };
}

export function saveCollectionsCardList(list: CollectionsCardListData[]): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollectionsCardList(list));
    };
}


export function loadCollectionsCard(collectionId: number, cardId: number): Operation<ApiResponse<CollectionsCardEntity>> {
    return async (dispatch, getState) => {
        return withCachedEntity(getState, getCollectionsCardEntity, cardId, async () => {
            const response = await api.collections.getCollectionsCard(collectionId, cardId);
            batched(dispatch, saveCollectionsCard(response.payload.item));
            return response;
        });
    };
}

export function addCollectionsCard(collectionId: number, card: CollectionsCardPostData): Operation<ApiResponse<CollectionsCardEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.addCollectionsCard(collectionId, card);
        const data = response.payload.item;
        batched(dispatch, saveCollectionsCard(data), actions.addCollectionsCard(collectionId, data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionsCardEntity(getState(), data.id)! };
    };
}

export function saveCollectionsCard(data: CollectionsCardData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollectionsCard(data));
    };
}

export function updateCollectionsCard(collectionId: number, cardId: number, card: Partial<CollectionsCardPostData>): Operation<ApiResponse<CollectionsCardEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.patchCollectionsCard(collectionId, cardId, card);
        const data = response.payload.item;
        batched(dispatch, saveCollectionsCard(data), actions.editCollectionsCard(cardId));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionsCardEntity(getState(), data.id)! };
    };
}

export function deleteCollectionsCard(collectionId: number, cardId: number): Operation<ApiResponse<{}>> {
    return async (dispatch) => {
        const response = await api.collections.deleteCollectionsCard(collectionId, cardId);
        // TODO: delete from collection list
        batched(dispatch, discardCollectionsCard(collectionId, cardId));
        return response;
    };
}

export function discardCollectionsCard(collectionId: number, cardId: number): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.deleteCollectionsCard(collectionId, cardId));
    };
}

export function importCollectionsCard(collectionId: number, cardImport: CollectionsCardImportPostData): Operation<ApiResponse<CollectionsCardEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.importCollectionsCard(collectionId, cardImport);
        const data = response.payload.item;
        batched(dispatch, saveCollectionsCard(data), actions.addCollectionsCard(collectionId, data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionsCardEntity(getState(), data.id)! };
    };
}
