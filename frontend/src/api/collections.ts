import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { CardListData } from '../types/cards';
import { CollectionListData, CollectionPostData, CollectionTagsData, CollectionsImportPostData, CollectionsImportTextPostData } from '../types/collections';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class CollectionsAPI extends BaseAPI {
    protected getCollectionUrl(): string {
        return 'collections';
    }

    public getCollectionList(params: CollectionQueryParams): ApiPromise<CollectionDataType<CollectionListData>> {
        return this.get(`${this.getCollectionUrl()}/?${toQueryString(params)}`);
    }

    public getCollection(id: number): ApiPromise<{ item: CollectionListData }> {
        return this.get(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX);
    }

    public addCollection(data: CollectionPostData): ApiPromise<{ item: CollectionListData }> {
        return this.post(`${this.getCollectionUrl()}` + URL_SUFFIX, data);
    }

    public patchCollection(id: number, data: Partial<CollectionPostData>): ApiPromise<{ item: CollectionListData }> {
        return this.patch(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX, data);
    }

    public deleteCollection(id: number): ApiPromise<{}> {
        return this.delete(`${this.getCollectionUrl()}/${id}` + URL_SUFFIX);
    }

    public importCollections(collectionId: number, data: CollectionsImportPostData): ApiPromise<{ item: CollectionListData }> {
        return this.post(`${this.getCollectionUrl()}/${collectionId}/import` + URL_SUFFIX, data);
    }

    public getCollectionCards(id: number): ApiPromise<CollectionDataType<CardListData>> {
        return this.get(`${this.getCollectionUrl()}/${id}/cards` + URL_SUFFIX);
    }

    public importTextCollectionCards(collectionId: number, data: CollectionsImportTextPostData): ApiPromise<CollectionDataType<CardListData>> {
        return this.post(`${this.getCollectionUrl()}/${collectionId}/importText` + URL_SUFFIX, data);
    }

    public completeCollectionImportReview(collectionId: number, importId: number): ApiPromise<{}> {
        return this.post(`${this.getCollectionUrl()}/${collectionId}/imports/${importId}/review` + URL_SUFFIX, {});
    }

    public getAllCollectionTags(): ApiPromise<CollectionTagsData> {
        return this.get(`${this.getCollectionUrl()}/tags` + URL_SUFFIX);
    }
}

export default CollectionsAPI;
