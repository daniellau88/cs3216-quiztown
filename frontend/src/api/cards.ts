import { ApiPromise } from '../types';
import { CardData, CardImportPostData, CardPostData } from '../types/cards';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CardsAPI extends BaseAPI {
    protected getCardUrl(): string {
        return 'cards';
    }

    public getCard(id: number): ApiPromise<{ card: CardData }> {
        console.log('Get cards ' + id);
        return this.get(`${this.getCardUrl()}/${id}` + URL_SUFFIX);
    }

    public addCard(data: CardPostData): ApiPromise<{ card: CardData }> {
        console.log('Adding card. Data name: ' + data.name);
        return this.post(`${this.getCardUrl()}` + URL_SUFFIX, data);
    }

    public patchCard(id: number, data: CardPostData): ApiPromise<{ card: CardData }> {
        return this.put(`${this.getCardUrl()}/${id}` + URL_SUFFIX, data);
    }

    public deleteCard(id: number): ApiPromise<{}> {
        return this.delete(`${this.getCardUrl()}/${id}` + URL_SUFFIX);
    }

    public importCard(data: CardImportPostData): ApiPromise<{ card: CardData }> {
        console.log('Import card. Data name: ' + data.file_key);
        return this.post(`${this.getCardUrl()}/import` + URL_SUFFIX, data);
    }
}

export default CardsAPI;
