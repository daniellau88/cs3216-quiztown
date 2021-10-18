import api from '../../api';
import { ApiResponse } from '../../types';
import { GoogleLoginPostData, LoginPostData, UserData } from '../../types/auth';
import { NormalizeOperation, Operation } from '../../types/store';
import { batched } from '../../utilities/store';

import * as actions from './actions';

export function googleLogin(loginData: GoogleLoginPostData): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.googleLogin(loginData);
        const data = response.payload.item;
        batched(dispatch, saveCurrentUser(data));
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

export function logout(): Operation<ApiResponse<{}>> {
    return async (dispatch, getState) => {
        const response = await api.auth.logout();
        batched(dispatch, actions.deleteCurrentUser());
        return { ...response };
    };
}

export function saveCurrentUser(data: UserData): NormalizeOperation {
    return (dispatch) => {
        dispatch(actions.saveCurrentUser(data));
    };
}
