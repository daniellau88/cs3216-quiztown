import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios';

import { ApiPromise, ApiResponse, StatusMessageType } from '../types';

import { csrfToken as initialToken } from './helpers/server-context';

const DEFAULT_API_RESPONSE: ApiResponse<{}> = Object.freeze({
    code: -1,
    payload: {},
    messages: [
        {
            content: 'Request failed. Please check your Internet connection.',
            type: StatusMessageType.Error,
        },
    ],
    errors: {},
});

// Set to read from env var
const client = axios.create({
    baseURL: '/api/v1/',
});

class BaseAPI {
    private static csrfToken = initialToken;

    private clientGet<D>(url: string, params?: any): AxiosPromise<ApiResponse<D>> {
        return client.get(url, { params, ...this.getConfig() });
    }

    private clientPost<D>(url: string, data: any = {}, multipart = false): AxiosPromise<ApiResponse<D>> {
        return client.post(url, data, this.getConfig(multipart));
    }

    private clientPut<D>(url: string, data: any = {}): AxiosPromise<ApiResponse<D>> {
        return client.put(url, data, this.getConfig());
    }

    private clientPatch<D>(url: string, data: any = {}): AxiosPromise<ApiResponse<D>> {
        return client.patch(url, data, this.getConfig());
    }

    private clientDelete<D>(url: string): AxiosPromise<ApiResponse<D>> {
        return client.delete(url, this.getConfig());
    }

    /**
     * Performs an asynchronous HTTP GET request to the given URL.
     * @param url The resource upon which to apply the request.
     * @param params The URL parameters to be sent with the request.
     * @returns ApiPromise<D> A Promise that resolves to `ApiResponse<D>` if the
     *     request was successful, or rejects with an `ApiResponse<{}>` if the request fails.
     */
    protected get<D>(url: string, params?: any): ApiPromise<D> {
        return processRequest(url, this.clientGet(url, params));
    }

    /**
     * Performs an asynchronous HTTP POST request to the given URL.
     * @param url The resource upon which to apply the request.
     * @param data The data to be sent along with the request.
     * @returns ApiPromise<D> A Promise that resolves to `ApiResponse<D>` if the
     *     request was successful, or rejects with an `ApiResponse<{}>` if the request fails.
     */
    protected post<D>(url: string, data: any = {}, multipart = false): ApiPromise<D> {
        return processRequest(url, this.clientPost(url, data, multipart));
    }

    /**
     * Performs an asynchronous HTTP PUT request to the given URL.
     * @param url The resource upon which to apply the request.
     * @param data The data to be sent along with the request.
     * @returns ApiPromise<D> A Promise that resolves to `ApiResponse<D>` if the
     *     request was successful, or rejects with an `ApiResponse<{}>` if the request fails.
     */
    protected put<D>(url: string, data: any = {}): ApiPromise<D> {
        return processRequest(url, this.clientPut(url, data));
    }

    /**
     * Performs an asynchronous HTTP PATCH request to the given URL.
     * @param url The resource upon which to apply the request.
     * @param data The data to be sent along with the request.
     * @returns ApiPromise<D> A Promise that resolves to `ApiResponse<D>` if the
     *     request was successful, or rejects with an `ApiResponse<{}>` if the request fails.
     */
    protected patch<D>(url: string, data: any = {}): ApiPromise<D> {
        return processRequest(url, this.clientPatch(url, data));
    }

    /**
     * Performs an asynchronous HTTP DELETE request to the given URL.
     * @param url The resource upon which to apply the request.
     * @returns ApiPromise<D> A Promise that resolves to `ApiResponse<D>` if the
     *     request was successful, or rejects with an `ApiResponse<{}>` if the request fails.
     */
    protected delete<D>(url: string): ApiPromise<D> {
        return processRequest(url, this.clientDelete(url));
    }

    private getConfig(multipart = false) {
        if (multipart) {
            return {
                headers: {
                    // Content-Type is set to undefined for the XHR to be sent as a multipart request,
                    // so binary data can be sent successfully to the backend.
                    'Content-Type': undefined,
                    Accept: 'application/json',
                    'X-CSRF-Token': BaseAPI.csrfToken,
                },
            };
        }
        return {
            headers: {
                Accept: 'application/json',
                'X-CSRF-Token': BaseAPI.csrfToken,
            },
        };
    }
}

function processRequest<D, M>(endpoint: string, promise: AxiosPromise<ApiResponse<D>>): ApiPromise<D, {}> {
    return promise
        .then((response: AxiosResponse) => {
            const apiResponse = response.data;
            if (process.env.NODE_ENV === 'development') {
                /* tslint:disable-next-line */
                console.info(`[API] ${apiResponse.code} ${endpoint} : ${getResponseMessages(apiResponse)}`);
            }
            return apiResponse;
        })
        .catch((error: AxiosError) => {
            const apiResponse: ApiResponse<{}> =
                error.response && error.response.data ? error.response.data : DEFAULT_API_RESPONSE;
            if (process.env.NODE_ENV === 'development') {
                /* tslint:disable-next-line */
                console.error(`[API] ${apiResponse.code} ${endpoint} : ${getResponseMessages(apiResponse)}`);
            }
            throw apiResponse;
        });
}

function getResponseMessages(response: ApiResponse<any>): string {
    return response.messages && response.messages.length > 0
        ? response.messages.map((message) => message.content).join(' : ')
        : '';
}

export default BaseAPI;
