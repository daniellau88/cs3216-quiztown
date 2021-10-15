export enum PublicActivityType {
    CollectionImport = 1,
    CollectionTemp = 2,
}

interface CollectionImportType {
    type: PublicActivityType.CollectionImport;
    params: {
        collection_id: number;
        import_id: number;
    };
}

interface PublicActivityBaseListData {
    id: number;
    message: string;
    created_at: number;
    type: PublicActivityType;
    is_viewed: boolean;
}

export type PublicActivityListData =
    PublicActivityBaseListData & (CollectionImportType);

interface PublicActivityBaseMiniEntity {
    id: number;
    message: string;
    created_at: number;
    type: PublicActivityType;
    is_viewed: boolean;
}

export type PublicActivityMiniEntity =
    PublicActivityBaseMiniEntity & (CollectionImportType);
