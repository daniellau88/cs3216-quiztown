import { UploadData, UploadTextData } from './uploads';

export interface CollectionPostData {
    name: string;
    private?: boolean;
    image_link?: string;
}

export interface CollectionListData {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number; // TODO: change to owner object
    image_link: string;
}

export interface CollectionData {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number; // TODO: change to owner object
    image_link: string;
}

export interface CollectionMiniEntity {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number;
    image_link: string;
}

export interface CollectionsCardImportPostData {
    file_name: string;
    file_key: string;
}

export interface CollectionsImportPostData {
    imports: UploadData[];
}

export interface CollectionCardTextImportPostData {
    imports: UploadTextData[];
    type: number;
}
