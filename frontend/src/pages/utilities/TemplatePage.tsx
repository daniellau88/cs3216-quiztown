import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Input,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';

import api from '../../api';
import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import { googleLogin } from '../../modules/auth/operations';
import { addCollection, deleteCollection, updateCollection } from '../../modules/collections/operations';
import CollectionsCardAddPage from '../../modules/collections/pages/CollectionsCardAddPage';
import CollectionsCardShowPage from '../../modules/collections/pages/CollectionsCardShowPage';
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

    const testCreateApi = () => {
        console.log('You clicked me! I\'m created! hehehe');
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

    const testUpdateApi = () => {
        console.log('You clicked me! I\'m updated! uwu');
        const collectionPostDataStub: CollectionPostData = { name: 'hi', owner_id: 1 };
        return handleApiRequest(dispatch, dispatch(updateCollection(1, collectionPostDataStub)))
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

    const testDeleteApi = () => {
        console.log('You clicked me! I\'m deleted :(');
        return handleApiRequest(dispatch, dispatch(deleteCollection(1)))
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

    const test = async (e: React.ChangeEvent<any>) => {
        const promises = [...e.target.files].map(async (file: File) => {
            await api.uploads.createUpload(file);
        });

        await Promise.all(promises);
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
                    <Button onClick={testCreateApi}>
                        Click me to test Create API!
                    </Button>
                    <Button onClick={testUpdateApi}>
                        Click me to test Update API!
                    </Button>
                    <Button onClick={testDeleteApi}>
                        Click me to test Delete API!
                    </Button>
                    <Input
                        type="file"
                        onChange={test}
                        inputProps={{ multiple: true }}
                    />
                    <CollectionsCardAddPage />
                    <CollectionsCardShowPage collectionId={2} cardId={78} />
                </Grid>
                <Grid>
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
