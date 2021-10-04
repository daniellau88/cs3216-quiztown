import BaseAPI from './base';
import { CollectionData, CollectionPostData } from '../types/collections';
import { ApiPromise } from '../types';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'tasks';
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ collections: CollectionData }> {
        return this.post(`${this.getCollectionUrl()}`, data);
    }
}

export default CollectionsAPI;
