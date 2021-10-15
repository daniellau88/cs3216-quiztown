export enum PublicActivityType {
    CollectionImport = 1,
}

export interface PublicActivityListData {
    id: number;
    message: string;
    type: PublicActivityType;
    params: { [key: string]: string | number };
    created_at: number;
}

export interface PublicActivityMiniEntity {
    id: number;
    message: string;
    type: PublicActivityType;
    params: { [key: string]: string | number };
    created_at: number;
}
