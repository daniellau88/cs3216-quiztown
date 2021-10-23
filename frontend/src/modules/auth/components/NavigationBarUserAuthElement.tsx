import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';

import { GoogleLoginPostData } from '../../../types/auth';
import { handleApiRequest } from '../../../utilities/ui';
import { googleLogin, loadCurrentUser } from '../operations';
import { getCurrentUser, getIsAuthenticated } from '../selectors';

import GoogleSignInButton from './GoogleSignInButton';
import UserDetailComponent from './UserDetailComponent';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'right',
        display: 'flex',
        width: '15vh',
    },
}));

const NavigationBarUserAuthElement: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('tokenId' in response) {
            const token = response.tokenId;
            const loginPostData: GoogleLoginPostData = { token_id: token };
            return handleApiRequest(dispatch, dispatch(googleLogin(loginPostData)))
                .then(() => {
                    console.log('Logged in');
                    location.reload();
                });
        }
    };

    return (
        <div className={classes.root}>
            {user != null ?
                <UserDetailComponent user={user} /> :
                <GoogleSignInButton onSuccess={onSuccess} />
            }
        </div>
    );
};

export default NavigationBarUserAuthElement;
