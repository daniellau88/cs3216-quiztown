import { Permissions } from './index';

export interface CardPostData {
    name: string;
    collection_id: number;
    flagged: number;
    image_file_key: string;
    box_number: number;
    next_date: string;
    answer_details: {
        results: AnswerData[]
    }
    question: string;
    answer: string;
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
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    is_reviewed: boolean;
    permissions: Permissions;
}

export interface CardData {
    id: number;
    name: string;
    collection_id: number;
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
    type: number;
    question: string;
    answer: string;
    is_reviewed: boolean;
    permissions: Permissions;
}

export interface CardMiniEntity {
    id: number;
    name: string;
    collection_id: number;
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    is_reviewed: boolean;
    permissions: Permissions;
}

export enum CardType {
    IMAGE = 0,
    TEXT = 1,
}

export interface CardEntity {
    id: number;
    name: string;
    collection_id: number;
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
    type: CardType;
    question: string;
    answer: string;
    is_reviewed: boolean;
    permissions: Permissions;
}
