import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { CardData, CardListData, CardPostData } from '../types/cards';
import { CollectionCardTextImportPostData } from '../types/collections';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CardsAPI extends BaseAPI {
    protected getCardUrl(): string {
        return 'cards';
    }

    public getCardList(params: CollectionQueryParams): ApiPromise<CollectionDataType<CardListData>> {
        return this.get(`${this.getCardUrl()}?${toQueryString(params)}`);
    }

    public getCard(cardId: number): ApiPromise<{ item: CardData }> {
        console.log('Get cards ' + cardId);
        return this.get(`${this.getCardUrl()}/${cardId}` + URL_SUFFIX);
    }

    public addCard(data: CardPostData): ApiPromise<{ item: CardData }> {
        console.log('Adding card. Data name: ' + data.name);
        return this.post(`${this.getCardUrl()}` + URL_SUFFIX, data);
    }

    public patchCard(cardId: number, data: Partial<CardPostData>): ApiPromise<{ item: CardData }> {
        return this.put(`${this.getCardUrl()}/${cardId}` + URL_SUFFIX, data);
    }

    public deleteCard(cardId: number): ApiPromise<{}> {
        return this.delete(`${this.getCardUrl()}/${cardId}` + URL_SUFFIX);
    }

    public importCollectionCardText(collectionId: number, data: CollectionCardTextImportPostData): ApiPromise<{ item: CardData }> {
        return this.post(`${this.getCardUrl()}/import` + URL_SUFFIX, data);
    }
}

export default CardsAPI;
