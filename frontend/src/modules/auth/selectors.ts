import { UserData } from '../../types/auth';
import { AppState } from '../../types/store';


function getLocalState(state: AppState) {
    return state.auth;
}

export function getCurrentUser(state: AppState): UserData | null {
    return getLocalState(state).currentUser;
}

export function getIsAuthenticated(state: AppState): boolean {
    return getLocalState(state).isAuthenticated;
}
