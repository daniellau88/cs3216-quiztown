import { UploadData } from './uploads';

export interface CollectionPostData {
    name: string;
    private?: boolean;
    image_link?: string;
    tags?: string[];
}

export interface CollectionListData {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number; // TODO: change to owner object
    image_link: string;
    tags: string[];
    num_cards: number;
}


export interface CollectionMiniEntity {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number;
    image_link: string;
    tags: string[];
    num_cards: number;
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
