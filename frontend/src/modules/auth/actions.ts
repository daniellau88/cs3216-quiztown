import { UserData } from '../../types/auth';

import * as types from './types';

export function saveCurrentUser(data: UserData): types.SaveCurrentUserAction {
    return {
        type: types.SAVE_CURRENT_USER,
        data,
    };
}

export function deleteCurrentUser(): types.DeleteCurrentUserAction {
    return {
        type: types.DELETE_CURRENT_USER,
    };
}

export function saveIsAuthenticated(isAuthenticated: boolean): types.SaveIsAuthenticatedAction {
    return {
        type: types.SAVE_IS_AUTHENTICATED,
        isAuthenticated,
    };
}
