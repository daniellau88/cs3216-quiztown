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
import ReactSlider from 'react-slider';

import api from '../../api';
import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import { googleLogin } from '../../modules/auth/operations';
import { addCollection, deleteCollection, updateCollection } from '../../modules/collections/operations';
import { GoogleLoginPostData } from '../../types/auth';
import { CollectionPostData } from '../../types/collections';
import { getFeedback } from '../../utilities/leitner';
import { handleApiRequest } from '../../utilities/ui';
import '../../assets/css/slider.css';

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
    const [interval, setInterval] = React.useState(0);

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

    const timeTaken = 15.0;
    const numOptions = 3;
    const numGuesses = 4;

    const testLeitner = () => {
        console.log('Leitner button poked!');
        const feedback = getFeedback(timeTaken, numOptions, numGuesses, currentBox);
        console.log(feedback.nextBoxNumber);
        console.log(feedback.intervalLength);
        setCurrentBox(feedback.nextBoxNumber);
        setInterval(feedback.intervalLength);
    };

    const onSliderChange = (value: any) => {
        setInterval(value);
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
                </Grid>
            </Box>
            <Box className={classes.root}>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                    min={0}
                    max={30}
                    defaultValue={interval}
                    value={interval}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    onAfterChange={(value) => onSliderChange(value)}
                />
            </Box>
            <Box className={classes.root}>
                <Typography>Current Box: {currentBox}, Your interval is set to: {interval} </Typography>
                <Grid>
                    <Button onClick={() => testLeitner()}>
                        Next Question
                    </Button>;
                </Grid>
            </Box>
            <Box className={classes.root}>
                <GoogleSignInButton onSuccess={onGoogleLoginSuccess} />
            </Box>
        </>
    );
};

export default TemplatePage;
