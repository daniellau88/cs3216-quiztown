export interface UploadData {
    file_key: string;
    file_name: string;
}

export interface UploadTextData {
    name: string;
    type: number;
    question: string;
    answer: string;
    collection_id: number;
}
