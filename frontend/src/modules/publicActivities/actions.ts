import { PublicActivityListData } from '../../types/publicActivities';

import * as types from './types';

export function enqueueRecentPublicActivity(data: PublicActivityListData): types.EnqueueRecentPublicActivityAction {
    return {
        type: types.ENQUEUE_RECENT_PUBLIC_ACTIVITY,
        data,
    };
}

export function savePublicActivityList(list: PublicActivityListData[]): types.SavePublicActivityListAction {
    return {
        type: types.SAVE_PUBLIC_ACTIVITY_LIST,
        list,
    };
}

export function updateRecentPublicActivityList(ids: number[]): types.UpdateRecentPublicActivityListAction {
    return {
        type: types.UPDATE_RECENT_PUBLIC_ACTIVITY_LIST,
        ids,
    };
}

export function savePublicActivity(data: PublicActivityListData): types.SavePublicActivityAction {
    return {
        type: types.SAVE_PUBLIC_ACTIVITY,
        data,
    };
}

export function editPublicActivity(): types.EditPublicActivityAction {
    return {
        type: types.EDIT_PUBLIC_ACTIVITY,
    };
}
