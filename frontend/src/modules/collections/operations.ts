import api from '../../api';
import * as cards from '../../modules/cards';
import { ApiResponse } from '../../types';
import { CollectionListData, CollectionMiniEntity, CollectionPostData, CollectionTagsData, CollectionsImportPostData } from '../../types/collections';
import { CollectionOptions, EntityCollection, NormalizeOperation, Operation } from '../../types/store';
import { batched, queryEntityCollection, withCachedEntity } from '../../utilities/store';

import * as actions from './actions';
import { getAllCollections, getAllPublicCollections, getCollectionMiniEntity } from './selectors';

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

export function saveCollection(data: CollectionListData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollection(data));
    };
}

export function updateCollection(id: number, collection: Partial<CollectionPostData>): Operation<ApiResponse<CollectionMiniEntity>> {
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

export function importCollections(collectionId: number, collectionsImport: CollectionsImportPostData): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.collections.importCollections(collectionId, collectionsImport);
        const data = response.payload.item;
        batched(dispatch, saveCollection(data));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response;
    };
}

export function completeCollectionImportReview(collectionId: number, importId: number): Operation<ApiResponse<{}>> {
    return async (dispatch) => {
        const response = await api.collections.completeCollectionImportReview(collectionId, importId);
        batched(dispatch, actions.resetCollection(collectionId), cards.operations.resetCollectionCards(collectionId));
        return response;
    };
}

export function getAllCollectionTags(): Operation<ApiResponse<CollectionTagsData>> {
    return async (dispatch) => {
        const response = await api.collections.getAllCollectionTags();
        const allTags = response.payload.items;
        dispatch(actions.loadTags(allTags));
        return response;
    };
}

export function loadAllPublicCollections(options: CollectionOptions): Operation<ApiResponse<EntityCollection>> {
    return (dispatch, getState) => {
        return queryEntityCollection(
            () => getAllPublicCollections(getState()),
            options,
            async (params) => {
                const response = await api.collections.getCollectionList(params);
                const data: CollectionListData[] = response.payload.items;
                batched(dispatch, saveCollectionList(data));
                return response;
            },
            (delta) => dispatch(actions.updatePublicCollectionList(delta)),
        );
    };
}

export function duplicatePublicCollection(collectionId: number): Operation<ApiResponse<CollectionMiniEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.duplicatePublicCollection(collectionId);
        const data = response.payload.item;
        batched(dispatch, saveCollection(data), actions.addCollection(data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionMiniEntity(getState(), data.id)! };
    };
}

export function resetCollection(collectionId: number): Operation<void> {
    return async (dispatch, getState) => {
        batched(dispatch, actions.resetCollection(collectionId));
    };
}
