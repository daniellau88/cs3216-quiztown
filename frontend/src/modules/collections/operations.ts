import api from '../../api';
import { ApiResponse } from '../../types';
import { CollectionData, CollectionEntity, CollectionListData, CollectionPostData } from '../../types/collections';
import { CollectionOptions, EntityCollection, NormalizeOperation, Operation } from '../../types/store';
import { batched, queryEntityCollection } from '../../utilities/store';

import * as actions from './actions';
import { getAllCollections, getCollectionEntity } from './selectors';

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

export function addCollection(collection: CollectionPostData): Operation<ApiResponse<CollectionEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.addCollection(collection);
        const data = response.payload.collection;
        batched(dispatch, saveCollection(data), actions.addCollection(data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionEntity(getState(), data.id)! };
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

export function updateCollection(id: number, collection: CollectionPostData): Operation<ApiResponse<CollectionEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.patchCollection(id, collection);
        const data = response.payload.collection;
        batched(dispatch, saveCollection(data), actions.editCollection());
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionEntity(getState(), data.id)! };
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
