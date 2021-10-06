import { ApiPromise } from '../types';
import { CollectionData, CollectionPostData } from '../types/collections';

import BaseAPI from './base';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections';
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ collection: CollectionData }> {
        console.log('Adding collection. Data name: ' + data.name);
        return this.post(`${this.getCollectionUrl()}/`, data);
    }

    public patchCollection(id: number, data: CollectionPostData): ApiPromise<{ collection: CollectionData }> {
        return this.put(`${this.getCollectionUrl()}/${id}/`, data);
    }

    public deleteCollection(id: number): ApiPromise<{}> {
        return this.delete(`${this.getCollectionUrl()}/${id}/`);
    }
}

export default CollectionsAPI;
