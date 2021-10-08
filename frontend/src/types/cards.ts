export interface CardPostData {
    name: string;
    collection_id: number;
    image_link: string;
}

export interface CardData {
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
}
