import api from '../../api';
import { ApiResponse } from '../../types';
import { GoogleLoginPostData, LoginPostData, SettingsPostData, UserData } from '../../types/auth';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';

export function googleLogin(loginData: GoogleLoginPostData): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.googleLogin(loginData);
        const data = response.payload.item;
        batched(dispatch, saveCurrentUser(data), saveIsAuthenticated(true));
        return { ...response };
    };
}

export function login(loginData: LoginPostData): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.login(loginData);
        const data = response.payload.item;
        batched(dispatch, saveCurrentUser(data));
        return { ...response };
    };
}

export function loadCurrentUser(): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.getUser();
        const data = response.payload.item;
        batched(dispatch, saveCurrentUser(data), saveIsAuthenticated(true));
        return { ...response };
    };
}

export function logout(): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.logout();
        batched(dispatch, resetCurrentUser());
        return { ...response };
    };
}

export function saveIsAuthenticated(isAuthenticated: boolean): Operation<void> {
    return async (dispatch, getState) => {
        batched(dispatch, actions.saveIsAuthenticated(isAuthenticated));
    };
}

export function resetCurrentUser(): Operation<void> {
    return async (dispatch, getState) => {
        batched(dispatch, actions.deleteCurrentUser());
    };
}

export function updateUserSettings(data: SettingsPostData): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.updateUserSettings(data);
        const item = response.payload.item;
        batched(dispatch, actions.saveUserSettings(item));
        return { ...response };
    };
}

export function saveCurrentUser(data: UserData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCurrentUser(data));
    };
}
