import api from '../../api';
import { ApiResponse } from '../../types';
import { Operation } from '../../types/store';
import { UploadData } from '../../types/uploads';

export function addUpload(file: File): Operation<ApiResponse<UploadData>> {
    return async (dispatch, getState) => {
        const response = await api.uploads.createUpload(file);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { ...response, payload: response.payload.upload };
    };
}
