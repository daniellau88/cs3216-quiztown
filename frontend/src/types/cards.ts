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

export enum CardType {
    IMAGE = 0,
    TEXT = 1,
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

interface CardBaseData {
    id: number;
    name: string;
    collection_id: number;
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    type: CardType;
    is_reviewed: boolean;
    permissions: Permissions;
}

interface CardImageData extends CardBaseData {
    type: CardType.IMAGE;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
}

interface CardTextData extends CardBaseData {
    type: CardType.TEXT;
    question: string;
    answer: string;
}

export type CardData = CardImageData | CardTextData;

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

interface CardBaseEntity {
    id: number;
    name: string;
    collection_id: number;
    flagged: number;
    image_link: string;
    box_number: number;
    next_date: string;
    created_at: number;
    type: CardType;
    is_reviewed: boolean;
    permissions: Permissions;
}

export interface CardImageEntity extends CardBaseEntity {
    type: CardType.IMAGE;
    image_metadata: ImageMetadata;
    answer_details: {
        results: AnswerData[];
    }
}

export interface CardTextEntity extends CardBaseEntity {
    type: CardType.TEXT;
    question: string;
    answer: string;
}

export type CardEntity = CardImageEntity | CardTextEntity;
