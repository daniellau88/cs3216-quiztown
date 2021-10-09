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

export interface CardMiniEntity {
    id: number;
    name: string;
    collection_id: number;
    is_flagged: string;
    image_link: string;
    next_date: Date;
    created_at: number;
}
