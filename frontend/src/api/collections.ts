import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { CardListData } from '../types/cards';
import { CollectionCardTextImportPostData, CollectionData, CollectionListData, CollectionPostData, CollectionsImportPostData } from '../types/collections';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections';
    }

    public getCollectionList(params: CollectionQueryParams): ApiPromise<CollectionDataType<CollectionListData>> {
        return this.get(`${this.getCollectionUrl()}?${toQueryString(params)}`);
    }

    public getCollection(id: number): ApiPromise<{ item: CollectionData }> {
        return this.get(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX);
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ item: CollectionData }> {
        console.log('Adding collection. Data name: ' + data.name);
        return this.post(`${this.getCollectionUrl()}` + URL_SUFFIX, data);
    }

    public patchCollection(id: number, data: CollectionPostData): ApiPromise<{ item: CollectionData }> {
        return this.put(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX, data);
    }

    public deleteCollection(id: number): ApiPromise<{}> {
        return this.delete(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX);
    }

    public importCollections(collectionId: number, data: CollectionsImportPostData): ApiPromise<{ item: CollectionData }> {
        // console.log('Import collection. Data name: ' + data[0].file_key);
        return this.post(`${this.getCollectionUrl()}/${collectionId}/import` + URL_SUFFIX, data);
    }

    public getCollectionCards(id: number): ApiPromise<CollectionDataType<CardListData>> {
        return this.get(`${this.getCollectionUrl()}/${id}/cards` + URL_SUFFIX);
    }

    public importTextCardToCollections(collectionId: number, data: CollectionCardTextImportPostData): ApiPromise<CollectionDataType<CardListData>> {
        return this.post(`${this.getCollectionUrl()}/${collectionId}/import` + URL_SUFFIX, data);
    }
}

export default CollectionsAPI;
