import api from '../../api';
import { ApiResponse, CollectionQueryParams } from '../../types';
import { PublicActivityListData, PublicActivityMiniEntity } from '../../types/publicActivities';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';
import { getPublicActivityMiniEntity, getRecentPublicActivities } from './selectors';

export function loadRecentPublicActivities(): Operation<ApiResponse<number[]>> {
    return async (dispatch, getState) => {
        const filter: CollectionQueryParams = {
            length: 5,
            start: 0,
            search: '',
            filters: {},
            sort_by: 'created_at',
            order: 'desc',
        };
        const response = await api.publicActivities.getPublicActivityList(filter);
        const data = response.payload.items;
        const ids = data.map(x => x.id);
        batched(dispatch, savePublicActivityList(data), actions.updateRecentPublicActivityList(ids));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: getRecentPublicActivities(getState())! };
    };
}

export function savePublicActivityList(list: PublicActivityListData[]): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.savePublicActivityList(list));
    };
}

// Returns void
export function subscribePublicActivity(onMessage: (message: PublicActivityMiniEntity) => void): NormalizeOperation {
    return async (dispatch, getState) => {
        const handleMessage = (message: ApiResponse<{ item: PublicActivityListData }>) => {
            const data = message.payload.item;
            batched(dispatch, actions.enqueueRecentPublicActivity(data));
            onMessage(getPublicActivityMiniEntity(getState(), data.id)!);
        };
        api.websocketPublicActivities.subscribePublicActivity(handleMessage);
        return;
    };
}
