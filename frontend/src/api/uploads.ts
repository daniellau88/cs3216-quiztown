import { ApiPromise } from '../types';
import { UploadData } from '../types/uploads';

import BaseAPI from './base';

export class UploadsAPI extends BaseAPI {
    protected getUploadsUrl(): string {
        return 'uploads/';
    }

    public createUpload(upload: File): ApiPromise<{ upload: UploadData }> {
        const formData = new FormData();
        formData.append('file', upload, upload.name);
        return this.post(`${this.getUploadsUrl()}`, formData);
    }
}


export default UploadsAPI;
