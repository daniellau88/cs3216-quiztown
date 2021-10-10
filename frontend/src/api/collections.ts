import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { CollectionData, CollectionListData, CollectionPostData, CollectionsCardData, CollectionsCardImportPostData, CollectionsCardListData, CollectionsCardPostData } from '../types/collections';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections';
    }

    public getCollectionList(params: CollectionQueryParams): ApiPromise<CollectionDataType<CollectionListData>> {
        return this.get(`${this.getCollectionUrl()}?${toQueryString(params)}` + URL_SUFFIX);
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

    protected getCollectionsCardUrl(collectionId: number): string {
        return `${this.getCollectionUrl()}/${collectionId}/cards`;
    }

    public getCollectionContentsList(collectionId: number, params: CollectionQueryParams): ApiPromise<CollectionDataType<CollectionsCardListData>> {
        return this.get(`${this.getCollectionsCardUrl(collectionId)}?${toQueryString(params)}` + URL_SUFFIX);
    }

    public getCollectionsCard(collectionId: number, cardId: number): ApiPromise<{ item: CollectionsCardData }> {
        console.log('Get cards ' + cardId);
        return this.get(`${this.getCollectionsCardUrl(collectionId)}/${cardId}` + URL_SUFFIX);
    }

    public addCollectionsCard(collectionId: number, data: CollectionsCardPostData): ApiPromise<{ item: CollectionsCardData }> {
        console.log('Adding card. Data name: ' + data.name);
        return this.post(`${this.getCollectionsCardUrl(collectionId)}` + URL_SUFFIX, data);
    }

    public patchCollectionsCard(collectionId: number, cardId: number, data: Partial<CollectionsCardPostData>): ApiPromise<{ item: CollectionsCardData }> {
        return this.put(`${this.getCollectionsCardUrl(collectionId)}/${cardId}` + URL_SUFFIX, data);
    }

    public deleteCollectionsCard(collectionId: number, cardId: number): ApiPromise<{}> {
        return this.delete(`${this.getCollectionsCardUrl(collectionId)}/${cardId}` + URL_SUFFIX);
    }

    public importCollectionsCard(collectionId: number, data: CollectionsCardImportPostData): ApiPromise<{ item: CollectionsCardData }> {
        console.log('Import card. Data name: ' + data.file_key);
        return this.post(`${this.getCollectionsCardUrl(collectionId)}/import` + URL_SUFFIX, data);
    }

    public importCollections(collectionId: number, data: CollectionsCardImportPostData): ApiPromise<{ item: CollectionData }> {
        console.log('Import collection. Data name: ' + data.file_key);
        return this.post(`${this.getCollectionUrl()}/${collectionId}/import` + URL_SUFFIX, data);
    }
}

export default CollectionsAPI;
