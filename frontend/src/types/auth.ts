export interface UserData {
    name: string;
    email: string;
    profile_picture_link: string;
}

export interface LoginPostData {
    username: string;
    password: string;
}

export interface GoogleLoginPostData {
    token_id: string;
}
