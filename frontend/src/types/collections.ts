import { UploadData } from './uploads';

import { Permissions } from './index';

type CollectionPermissions = Permissions<'can_update' | 'can_delete' | 'can_create_card'>;

// TODO: Change to boolean
export enum CollectionPrivate {
    PRIVATE = 0,
    PUBLIC = 1,
}

export interface CollectionPostData {
    name: string;
    private?: CollectionPrivate;
    image_file_key?: string;
    tags?: string[];
}

export interface CollectionListData {
    id: number;
    name: string;
    private: CollectionPrivate;
    created_at: number;
    owner_id: number; // TODO: change to owner object
    image_link: string;
    tags: string[];
    num_cards: number;
    permissions: CollectionPermissions;
    duplicate_collection_id: number;
}


export interface CollectionMiniEntity {
    id: number;
    name: string;
    private: CollectionPrivate;
    created_at: number;
    owner_id: number;
    image_link: string;
    tags: string[];
    num_cards: number;
    permissions: CollectionPermissions;
    duplicate_collection_id: number;
}

export interface CollectionsCardImportPostData {
    file_name: string;
    file_key: string;
}

export interface CollectionsImportPostData {
    imports: UploadData[];
}

export interface UploadTextData {
    name: string;
    question: string;
    answer: string;
}

export interface CollectionsImportTextPostData {
    imports: UploadTextData[];
}

export interface TagData {
    id: number;
    name: string;
}

export interface CollectionTagsData {
    items: TagData[];
}
