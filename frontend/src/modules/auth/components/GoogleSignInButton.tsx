import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';

import { GoogleLoginPostData } from '../../../types/auth';
import { handleApiRequest } from '../../../utilities/ui';
import { googleLogin } from '../operations';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        boxSizing: 'content-box',
    },
}));

const GoogleSignInButton: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;
    if (!clientId) {
        console.error('Client ID not initialized');
        return null;
    }

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

    return (
        <div className={classes.root}>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default GoogleSignInButton;
