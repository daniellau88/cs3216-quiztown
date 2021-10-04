import { ApiPromise } from '../types';
import { GoogleLoginPostData, LoginPostData, LoginResponseData } from '../types/auth';

import BaseAPI from './base';

export class AuthAPI extends BaseAPI {
    protected getAuthUrl(): string {
        return 'auth/';
    }

    public login(data: LoginPostData): ApiPromise<LoginResponseData> {
        console.log('Logging in');
        return this.post(`${this.getAuthUrl()}/login`, data);
    }

    public googleLogin(data: GoogleLoginPostData): ApiPromise<LoginResponseData> {
        console.log('Logging in with google');
        return this.post(`${this.getAuthUrl()}/googleLogin`, data);
    }
}

export default AuthAPI;
