import produce from 'immer';

import { createEntityCollection, createEntityStore, saveEntityToStore, saveListToStore } from '../../utilities/store';

import * as types from './types';

const initialState: types.PublicActivitiesState = {
    allPublicActivities: createEntityCollection(),
    publicActivities: createEntityStore(),

    recentPublicActivities: [],
};

const MAX_RECENT_PUBLIC_ACTIVITY = 5;

const publicActivitiesReducer = produce((draft: types.PublicActivitiesState, action: types.PublicActivitiesActionTypes) => {
    switch (action.type) {
        case types.ENQUEUE_RECENT_PUBLIC_ACTIVITY: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.publicActivities, entity);
            const newList = draft.recentPublicActivities.slice(0, MAX_RECENT_PUBLIC_ACTIVITY - 1);
            // append to front of list
            newList.unshift(action.data.id);
            draft.recentPublicActivities = newList;
            return;
        }
        case types.SAVE_PUBLIC_ACTIVITY_LIST: {
            const list = action.list.map((data) => ({
                ...data,
            }));
            saveListToStore(draft.publicActivities, list);
            return;
        }
        case types.UPDATE_RECENT_PUBLIC_ACTIVITY_LIST: {
            draft.recentPublicActivities = action.ids;
            return;
        }
        case types.SAVE_PUBLIC_ACTIVITY: {
            const data = action.data;
            const entity = {
                ...data,
            };
            saveEntityToStore(draft.publicActivities, entity);
            return;
        }
        case types.EDIT_PUBLIC_ACTIVITY: {
            return;
        }
    }
}, initialState);

export default publicActivitiesReducer;
