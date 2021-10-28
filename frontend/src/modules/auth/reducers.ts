import produce from 'immer';

import * as types from './types';

const initialState: types.AuthState = {
    currentUser: null,
    isAuthenticated: false,
};

const authReducer = produce((draft: types.AuthState, action: types.AuthActionTypes) => {
    switch (action.type) {
        case types.SAVE_CURRENT_USER: {
            const data = action.data;
            draft.currentUser = data;
            return;
        }
        case types.DELETE_CURRENT_USER: {
            draft.currentUser = null;
            return;
        }
        case types.SAVE_IS_AUTHENTICATED: {
            draft.isAuthenticated = action.isAuthenticated;
            return;
        }
        case types.SAVE_USER_SETTINGS: {
            if (draft.currentUser) {
                draft.currentUser.settings = action.data;
            }
            return;
        }
    }
}, initialState);

export default authReducer;
