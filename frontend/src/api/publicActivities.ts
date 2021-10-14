import { ApiPromise, CollectionData as CollectionDataType, CollectionQueryParams } from '../types';
import { PublicActivityListData } from '../types/publicActivities';
import { toQueryString } from '../utilities/url';

import BaseAPI from './base';
import { URL_SUFFIX } from './helpers/url-suffix';

export class PublicActivitiesAPI extends BaseAPI {
    protected getPublicActivityUrl(): string {
        return 'publicActivities';
    }

    public getPublicActivityList(params: CollectionQueryParams): ApiPromise<CollectionDataType<PublicActivityListData>> {
        return this.get(`${this.getPublicActivityUrl()}?${toQueryString(params)}` + URL_SUFFIX);
    }
}

export default PublicActivitiesAPI;
