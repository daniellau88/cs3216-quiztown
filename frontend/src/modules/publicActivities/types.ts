import { PublicActivityListData, PublicActivityMiniEntity } from '../../types/publicActivities';
import { EntityCollection, EntityStore } from '../../types/store';

// action names

export const ENQUEUE_RECENT_PUBLIC_ACTIVITY = 'publicActivities/ENQUEUE_RECENT_PUBLIC_ACTIVITY';
export const SAVE_PUBLIC_ACTIVITY_LIST = 'publicActivities/SAVE_PUBLIC_ACTIVITY_LIST';
export const UPDATE_RECENT_PUBLIC_ACTIVITY_LIST = 'publicActivities/UPDATE_RECENT_PUBLIC_ACTIVITY_LIST';

// action types

export interface EnqueueRecentPublicActivityAction {
    type: typeof ENQUEUE_RECENT_PUBLIC_ACTIVITY;
    data: PublicActivityListData;
}

export interface SavePublicActivityListAction {
    type: typeof SAVE_PUBLIC_ACTIVITY_LIST;
    list: PublicActivityListData[];
}

export interface UpdateRecentPublicActivityListAction {
    type: typeof UPDATE_RECENT_PUBLIC_ACTIVITY_LIST;
    ids: number[];
}

export type PublicActivitiesActionTypes =
    EnqueueRecentPublicActivityAction |
    SavePublicActivityListAction |
    UpdateRecentPublicActivityListAction;

// state types

export interface PublicActivitiesState {
    allPublicActivities: EntityCollection;
    publicActivities: EntityStore<PublicActivityMiniEntity, PublicActivityMiniEntity>;

    // Sorted in descending order (most recent to least recent)
    recentPublicActivities: number[];
}
