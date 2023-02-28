import { Link } from '@material-ui/core';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { GoogleLoginPostData } from '../../../types/auth';
import { handleApiRequest } from '../../../utilities/ui';
import { googleLogin } from '../operations';

interface OwnProps {
    children?: React.ReactNode;
    className?: string;
}

type Props = OwnProps;

const GoogleSignInLink: React.FC<Props> = ({ children, className }: Props) => {
    const dispatch = useDispatch();
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;

    const onSuccess = (response: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
        const token = response.access_token;
        if (token) {
            const loginPostData: GoogleLoginPostData = { token_id: token };
            return handleApiRequest(dispatch, dispatch(googleLogin(loginPostData)))
                .then(() => {
                    location.reload();
                });
        }
    };

    // Attempt login
    const signIn = useGoogleLogin({
        onSuccess: onSuccess,
    });

    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

    return (
        <Link className={className} onClick={() => signIn()}>
            {children}
        </Link>
    );
};

export default GoogleSignInLink;
