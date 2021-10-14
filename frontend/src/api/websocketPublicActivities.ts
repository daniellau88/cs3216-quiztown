import { w3cwebsocket } from 'websocket';

import { ApiResponse } from '../types';
import { PublicActivityListData } from '../types/publicActivities';

import { Token, getCookie } from './helpers/server-context';
import { URL_SUFFIX } from './helpers/url-suffix';

const BaseWebsocketURL = 'ws://localhost:8000/ws';

export class WebsocketPublicActivitiesAPI {
    public subscribePublicActivity(onMessage: (onMessage: ApiResponse<PublicActivityListData>) => void): void {
        this.sendConnection(`${BaseWebsocketURL}/subscribePublicActivity` + URL_SUFFIX, onMessage);
    }

    protected sendConnection<D>(endpoint: string, onMessage: (res: ApiResponse<D>) => void): void {
        const client = new w3cwebsocket(endpoint, '', '', this.getConfigHeaders());

        client.onopen = () => {
            if (process.env.NODE_ENV === 'development') {
                console.info(`[WebsocketAPI] ${endpoint} open`);
            }
        };
        client.onmessage = (message) => {
            const apiResponse = JSON.parse(message.data as string) as ApiResponse<D>;
            if (process.env.NODE_ENV === 'development') {
                console.info(`[WebsocketAPI] ${apiResponse.code} ${endpoint} ${message}`);
            }
            onMessage(apiResponse);
        };
        client.onclose = () => {
            if (process.env.NODE_ENV === 'development') {
                console.info(`[WebsocketAPI] ${endpoint} closed`);
            }
        };
        client.onerror = (err) => {
            if (process.env.NODE_ENV === 'development') {
                console.info(`[WebsocketAPI] ${endpoint} error ${err}`);
            }
        };

        return;
    }

    private getConfigHeaders() {
        return {
            'Cookie': getCookie(),
            'X-CSRFToken': Token.getCsrfToken(),
        };
    }
}

export default WebsocketPublicActivitiesAPI;
