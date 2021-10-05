import { ApiPromise } from '../types';
import { CollectionData, CollectionPostData } from '../types/collections';

import BaseAPI from './base';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections/';
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ collection: CollectionData }> {
        console.log('Adding collection. Data name: ' + data.name);
        return this.post(`${this.getCollectionUrl()}`, data);
    }
}

export default CollectionsAPI;
