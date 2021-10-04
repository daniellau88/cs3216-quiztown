import { UserData } from '../../types/auth';

// Action Names

export const SAVE_CURRENT_USER = 'auth/SAVE_CURRENT_USER';

// Action Types

export interface SaveCurrentUserAction {
    type: typeof SAVE_CURRENT_USER;
    data: UserData;
}

export type AuthActionTypes = SaveCurrentUserAction;

// State Types
export interface AuthState {
    currentUser: UserData | null;
}
