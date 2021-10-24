import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { PublicActivityListData, PublicActivityPostData } from '../types/publicActivities';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class PublicActivitiesAPI extends BaseAPI {
    protected getPublicActivityUrl(): string {
        return 'publicActivities';
    }

    public getPublicActivityList(params: CollectionQueryParams): ApiPromise<CollectionDataType<PublicActivityListData>> {
        return this.get(`${this.getPublicActivityUrl()}/?${toQueryString(params)}`);
    }

    public patchPublicActivity(id: number, data: PublicActivityPostData): ApiPromise<{ item: PublicActivityListData }> {
        return this.patch(`${this.getPublicActivityUrl()}/${id}` + URL_SUFFIX, data);
    }
}

export default PublicActivitiesAPI;
