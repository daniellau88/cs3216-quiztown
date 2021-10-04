import { CollectionData } from '../../types/collections';
import * as types from './types';

export function saveCollection(data: CollectionData): types.SaveCollectionAction {
    return {
        type: types.SAVE_COLLECTION,
        data,
    };
}

export function addCollection(id: number): types.AddCollectionAction {
    return {
        type: types.ADD_COLLECTION,
        id,
    };
}
