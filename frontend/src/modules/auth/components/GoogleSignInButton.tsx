import { makeStyles } from '@material-ui/core';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import * as React from 'react';
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

    const onSuccess = (response: CredentialResponse) => {
        const token = response.credential;
        if (token) {
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
                text="signin"
                size="medium"
                onSuccess={onSuccess} />

        </div>
    );
};

export default GoogleSignInButton;
