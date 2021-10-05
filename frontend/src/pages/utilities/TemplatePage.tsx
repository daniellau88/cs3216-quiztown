import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';

import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import { googleLogin } from '../../modules/auth/operations';
import { addCollection } from '../../modules/collections/operations';
import { GoogleLoginPostData } from '../../types/auth';
import { CollectionPostData } from '../../types/collections';
import { handleApiRequest } from '../../utilities/ui';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
}));

const TemplatePage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    console.log('Template page.');

    const testApi = () => {
        console.log('You clicked me!');
        const collectionPostDataStub: CollectionPostData = { name: 'hi', owner_id: 1 };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataStub)))
            .then((response) => {
                console.log(response);
            })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    };

    const onGoogleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ('tokenId' in response) {
            const token = response.tokenId;
            const loginPostData: GoogleLoginPostData = { token_id: token };
            return handleApiRequest(dispatch, dispatch(googleLogin(loginPostData)))
                .then((response) => {
                    console.log(response);
                })
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false;
                });
        }
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid>
                    <Typography>
                        uwu
                    </Typography>
                    <Button onClick={testApi}>
                        click me!
                    </Button>
                    <GoogleSignInButton onSuccess={onGoogleLoginSuccess} />
                </Grid>
            </Box>
        </>
    );
};

export default TemplatePage;
