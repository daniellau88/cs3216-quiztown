import api from '../../api';
import { ApiResponse } from '../../types';
import { CollectionData, CollectionEntity, CollectionPostData } from '../../types/collections';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';
import { getCollectionEntity } from './selectors';

export function addCollection(collection: CollectionPostData): Operation<ApiResponse<CollectionEntity>> {
    return async (dispatch, getState) => {
        const response = await api.collections.addCollection(collection);
        const data = response.payload.collection;
        batched(dispatch, saveCollection(data), actions.addCollection(data.id));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getCollectionEntity(getState(), data.id)! };
    };
}

export function saveCollection(data: CollectionData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCollection(data));
    };
}