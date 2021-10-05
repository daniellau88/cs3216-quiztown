import { ApiPromise } from '../types';
import { GoogleLoginPostData, LoginPostData, LoginResponseData } from '../types/auth';

import BaseAPI from './base';

export class AuthAPI extends BaseAPI {
    protected getAuthUrl(): string {
        return 'auth/';
    }

    public login(data: LoginPostData): ApiPromise<LoginResponseData> {
        console.log('Logging in');
        const resp: ApiPromise<LoginResponseData> = this.post(`${this.getAuthUrl()}/login`, data);
        BaseAPI.refreshCsrfToken();
        return resp;
    }

    public googleLogin(data: GoogleLoginPostData): ApiPromise<LoginResponseData> {
        console.log('Logging in with google');
        const resp: ApiPromise<LoginResponseData> = this.post(`${this.getAuthUrl()}/googleLogin`, data);
        BaseAPI.refreshCsrfToken();
        return resp;
    }
}

export default AuthAPI;
