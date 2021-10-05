export interface CollectionPostData {
    name: string;
    owner_id: number;
}

export interface CollectionData {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number; // TODO: change to owner object
}

export interface CollectionEntity {
    id: number;
    name: string;
    private: boolean;
    created_at: number;
    owner_id: number; // TODO: change to owner object
}
