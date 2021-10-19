import { ApiPromise } from '../types';
import { GoogleLoginPostData, LoginPostData, UserData } from '../types/auth';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class AuthAPI extends BaseAPI {
    protected getAuthUrl(): string {
        return 'auth';
    }

    public login(data: LoginPostData): ApiPromise<{ item: UserData }> {
        console.log('Logging in');
        const resp: ApiPromise<{ item: UserData }> = this.post(`${this.getAuthUrl()}/login` + URL_SUFFIX, data);
        const apiResponse = resp.then((response) => {
            BaseAPI.refreshCsrfToken();
            return response;
        });
        return apiResponse;
    }

    public googleLogin(data: GoogleLoginPostData): ApiPromise<{ item: UserData }> {
        console.log('Logging in with google');
        const resp: ApiPromise<{ item: UserData }> = this.post(`${this.getAuthUrl()}/googleLogin` + URL_SUFFIX, data);
        const apiResponse = resp.then((response) => {
            BaseAPI.refreshCsrfToken();
            return response;
        });
        return apiResponse;
    }

    public logout(): ApiPromise<{}> {
        console.log('Logging out');
        const resp: ApiPromise<{ item: UserData }> = this.post(`${this.getAuthUrl()}/logout` + URL_SUFFIX);
        const apiResponse = resp.then((response) => {
            BaseAPI.refreshCsrfToken();
            return response;
        });
        return apiResponse;
    }
}

export default AuthAPI;
