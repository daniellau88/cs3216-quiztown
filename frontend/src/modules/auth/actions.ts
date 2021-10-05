import { UserData } from '../../types/auth';

import * as types from './types';

export function saveCurrentUser(data: UserData): types.SaveCurrentUserAction {
    return {
        type: types.SAVE_CURRENT_USER,
        data,
    };
}
