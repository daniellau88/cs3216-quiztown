import { ApiPromise } from '../types';
import { GoogleLoginPostData, LoginPostData, UserData } from '../types/auth';

import BaseAPI from './base';

export class AuthAPI extends BaseAPI {
    protected getAuthUrl(): string {
        return 'auth/';
    }

    public login(data: LoginPostData): ApiPromise<{ item: UserData }> {
        console.log('Logging in');
        const resp: ApiPromise<{ item: UserData }> = this.post(`${this.getAuthUrl()}/login`, data);
        BaseAPI.refreshCsrfToken();
        return resp;
    }

    public googleLogin(data: GoogleLoginPostData): ApiPromise<{ item: UserData }> {
        console.log('Logging in with google');
        const resp: ApiPromise<{ item: UserData }> = this.post(`${this.getAuthUrl()}/googleLogin`, data);
        BaseAPI.refreshCsrfToken();
        return resp;
    }
}

export default AuthAPI;
