import { w3cwebsocket } from 'websocket';

import { ApiResponse } from '../types';
import { PublicActivityListData } from '../types/publicActivities';

import { Token, getCookie } from './helpers/server-context';
import { URL_SUFFIX } from './helpers/url-suffix';

const BaseWebsocketURL = 'ws://localhost:8000/ws';
const RestartInterval = 3000;

export class WebsocketPublicActivitiesAPI {
    private static isSubscribedPublicActivity = false;

    public subscribePublicActivity(onMessage: (message: ApiResponse<{ item: PublicActivityListData }>) => void, restartConnection = true): void {
        if (WebsocketPublicActivitiesAPI.isSubscribedPublicActivity) {
            console.log('Already subscribed');
            return;
        }
        WebsocketPublicActivitiesAPI.isSubscribedPublicActivity = true;
        this.sendConnection(`${BaseWebsocketURL}/subscribePublicActivity` + URL_SUFFIX, onMessage, restartConnection);
    }

    protected sendConnection<D>(endpoint: string, onMessage: (res: ApiResponse<D>) => void, restartConnection = true): void {
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
            if (restartConnection) {
                // Try to reconnect
                setTimeout(() => {
                    this.sendConnection(endpoint, onMessage, restartConnection);
                }, RestartInterval);
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
