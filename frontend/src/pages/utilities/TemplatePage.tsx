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
import { getIntervals, getNextBoxNumber, getNextIntervalEndDate } from '../../utilities/leitner';
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
    const [currentBox, setCurrentBox] = React.useState(0);

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

    const testLeitner = (nextBox: number) => {
        console.log('Leitner button poked!');
        console.log(currentBox + ' ' + nextBox);
        console.log('Date: ' + getNextIntervalEndDate(nextBox));
        setCurrentBox(nextBox);
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
                        Click me to test API!
                    </Button>
                    {getIntervals(currentBox).map((interval, index) => {
                        console.log(index + ' e ' + interval);
                        const button =
                            <Button onClick={() => testLeitner(getNextBoxNumber(currentBox, index + 1))}>
                                Confidence: {index + 1}, Interval: {interval}
                            </Button>;
                        return button;
                    })}
                    <GoogleSignInButton onSuccess={onGoogleLoginSuccess} />
                </Grid>
            </Box>
        </>
    );
};

export default TemplatePage;
