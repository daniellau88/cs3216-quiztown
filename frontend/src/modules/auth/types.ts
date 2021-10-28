import { SettingsData, UserData } from '../../types/auth';

// Action Names

export const SAVE_CURRENT_USER = 'auth/SAVE_CURRENT_USER';
export const DELETE_CURRENT_USER = 'auth/DELETE_CURRENT_USER';
export const SAVE_IS_AUTHENTICATED = 'auth/SAVE_IS_AUTHENTICATED';
export const SAVE_USER_SETTINGS = 'auth/SAVE_USER_SETTINGS';

// Action Types
export interface SaveCurrentUserAction {
    type: typeof SAVE_CURRENT_USER;
    data: UserData;
}

export interface DeleteCurrentUserAction {
    type: typeof DELETE_CURRENT_USER;
}

export interface SaveIsAuthenticatedAction {
    type: typeof SAVE_IS_AUTHENTICATED;
    isAuthenticated: boolean;
}

export interface SaveUserSettingsAction {
    type: typeof SAVE_USER_SETTINGS;
    data: SettingsData;
}

export type AuthActionTypes =
    SaveCurrentUserAction |
    DeleteCurrentUserAction |
    SaveIsAuthenticatedAction |
    SaveUserSettingsAction;

// State Types
export interface AuthState {
    currentUser: UserData | null;
    isAuthenticated: boolean;
}
