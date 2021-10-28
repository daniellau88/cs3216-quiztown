import { Link } from '@material-ui/core';
import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
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

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('tokenId' in response) {
            const token = response.tokenId;
            const loginPostData: GoogleLoginPostData = { token_id: token };
            return handleApiRequest(dispatch, dispatch(googleLogin(loginPostData)))
                .then(() => {
                    location.reload();
                });
        }
    };

    // Attempt login
    const { signIn, loaded } = useGoogleLogin({
        onSuccess,
        clientId: clientId ? clientId : '',
        isSignedIn: false,
    });

    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

    return (
        <Link className={className} onClick={signIn}>
            {children}
        </Link>
    );
};

export default GoogleSignInLink;
