export interface UserData {
    user_id: number;
    name: string;
    email: string;
    profile_picture_link: string;
    settings: SettingsData;
}

export type SettingsKeys = 'collection_import_review.hide_prompt';

export type SettingsData = {
    [key in SettingsKeys]: number;
}

export interface SettingsPostData {
    settings_key: SettingsKeys;
    settings_value: number;
}

export interface LoginPostData {
    username: string;
    password: string;
}

export interface GoogleLoginPostData {
    token_id: string;
}
