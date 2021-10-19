import { UserData } from '../../types/auth';

// Action Names

export const SAVE_CURRENT_USER = 'auth/SAVE_CURRENT_USER';
export const DELETE_CURRENT_USER = 'auth/DELETE_CURRENT_USER';

// Action Types

export interface SaveCurrentUserAction {
    type: typeof SAVE_CURRENT_USER;
    data: UserData;
}

export interface DeleteCurrentUserAction {
    type: typeof DELETE_CURRENT_USER;
}

export type AuthActionTypes = SaveCurrentUserAction | DeleteCurrentUserAction;

// State Types
export interface AuthState {
    currentUser: UserData | null;
}
