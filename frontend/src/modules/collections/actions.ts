import { CollectionListData, TagData } from '../../types/collections';
import { CollectionDelta } from '../../types/store';

import * as types from './types';

export function saveCollectionList(list: CollectionListData[]): types.SaveCollectionListAction {
    return {
        type: types.SAVE_COLLECTION_LIST,
        list,
    };
}

export function saveCollection(data: CollectionListData): types.SaveCollectionAction {
    return {
        type: types.SAVE_COLLECTION,
        data,
    };
}

export function updateCollectionList(delta: CollectionDelta): types.UpdateCollectionListAction {
    return {
        type: types.UPDATE_COLLECTION_LIST,
        delta,
    };
}

export function addCollection(id: number): types.AddCollectionAction {
    return {
        type: types.ADD_COLLECTION,
        id,
    };
}

export function editCollection(): types.EditCollectionAction {
    return {
        type: types.EDIT_COLLECTION,
    };
}

export function deleteCollection(id: number): types.DeleteCollectionAction {
    return {
        type: types.DELETE_COLLECTION,
        id: id,
    };
}

export function updatePublicCollectionList(delta: CollectionDelta): types.UpdatePublicCollectionListAction {
    return {
        type: types.UPDATE_PUBLIC_COLLECTION_LIST,
        delta,
    };
}

export function loadTags(allTags: TagData[]): types.LoadTagsAction {
    return {
        type: types.LOAD_TAGS,
        data: allTags,
    };
}

export function resetCollection(id: number): types.ResetCollectionAction {
    return {
        type: types.RESET_COLLECTION,
        id,
    };
}
