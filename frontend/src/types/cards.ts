
export interface CardPostData {
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

export interface CardListData {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
}

export interface CardData {
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

export interface CardMiniEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    box_number: number;
    next_date: Date;
    created_at: number;
}
export interface CardEntity {
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
