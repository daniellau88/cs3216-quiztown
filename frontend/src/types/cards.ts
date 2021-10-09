export interface CardPostData {
    name: string;
    collection_id: number;
    image_link: string;
}

type Coordinate = [number, number];
export interface AnswerDetail {
    bounding_box: [Coordinate, Coordinate];
    text: string;
    confidence: number;
}

interface ImageMetadata {
    width: number;
    height: number;
}

export interface CardListData {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    next_date: Date;
    created_at: number;
}

export interface CardData {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    next_date: Date;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: AnswerDetail[];
}

export interface CardMiniEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    next_date: Date;
    created_at: number;
}

export interface CardEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    next_date: Date;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: AnswerDetail[];
}

export interface CardImportPostData {
    file_name: string;
    file_key: string;
}
