import { ApiPromise } from '../types';
import { CardData, CardPostData} from '../types/cards';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CardsAPI extends BaseAPI {
    protected getCardUrl(): string {
        return 'cards';
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
}

export default CardsAPI;
