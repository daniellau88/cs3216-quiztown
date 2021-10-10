export interface CollectionPostData {
    name: string;
    owner_id: number;
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

export interface CollectionsCardPostData {
    name: string;
    collection_id: number;
    image_link: string;
    box_number: number;
    next_date: string;
}

type Coordinate = [number, number];
export interface AnswerData {
    bounding_box: [Coordinate, Coordinate];
    text: string;
    confidence: number;
}

interface ImageMetadata {
    width: number;
    height: number;
}

export interface CollectionsCardListData {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
}

export interface CollectionsCardData {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
}

export interface CollectionsCardMiniEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
}
export interface CollectionsCardEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
}

export interface CollectionsCardImportPostData {
    file_name: string;
    file_key: string;
}
