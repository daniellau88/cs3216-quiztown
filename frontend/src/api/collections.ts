import BaseAPI from './base';
import { CollectionData, CollectionPostData } from '../types/collections';
import { ApiPromise } from '../types';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections/';
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ collections: CollectionData }> {
        console.log('Adding collection. Data ID: ' + data.id);
        return this.post(`${this.getCollectionUrl()}`, data);
    }
}

export default CollectionsAPI;
