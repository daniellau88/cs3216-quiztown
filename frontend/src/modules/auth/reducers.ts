import produce from 'immer';

import * as types from './types';

const initialState: types.AuthState = {
    currentUser: null,
};

const authReducer = produce((draft: types.AuthState, action: types.AuthActionTypes) => {
    switch (action.type) {
        case types.SAVE_CURRENT_USER: {
            const data = action.data;
            draft.currentUser = data;
            return;
        }
    }
}, initialState);

export default authReducer;
