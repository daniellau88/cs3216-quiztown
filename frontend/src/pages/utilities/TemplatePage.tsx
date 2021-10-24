import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Input,
    Typography,
    makeStyles,
} from '@material-ui/core';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import * as React from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';

import api from '../../api';
import GoogleSignInButton from '../../modules/auth/components/GoogleSignInButton';
import { googleLogin } from '../../modules/auth/operations';
import { addCollection, deleteCollection, updateCollection } from '../../modules/collections/operations';
import { GoogleLoginPostData } from '../../types/auth';
import { CollectionPostData } from '../../types/collections';
import { Feedback, getFeedbackSet } from '../../utilities/leitner';
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

    console.log('Template page.');

    const testCreateApi = () => {
        console.log('You clicked me! I\'m created! hehehe');
        const collectionPostDataStub: CollectionPostData = { name: 'hi' };
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
        const collectionPostDataStub: CollectionPostData = { name: 'hi' };
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

    const timeTaken = 10.0;
    const numOptions = 3;
    const numGuesses = 0;

    const testLeitner = (feedback: Feedback) => {
        console.log('Leitner button poked!');
        console.log(feedback.nextBoxNumber);
        console.log(feedback.intervalLength);
        setCurrentBox(feedback.nextBoxNumber);
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
                {getFeedbackSet(timeTaken, numOptions, numGuesses, 0, currentBox).map((feedback: Feedback, index: number) => {
                    console.log(feedback);
                    return <Button key={index} onClick={() => testLeitner(feedback)}>
                        <Grid alignItems='center' justifyContent='center' direction='column'>
                            {index == 0 ? <SentimentVeryDissatisfiedIcon /> : index == 1 ? <SentimentSatisfiedIcon /> : <SentimentVerySatisfiedIcon />}
                            <Typography align='center'>
                                Interval: {feedback.intervalLength}
                            </Typography>
                        </Grid>
                    </Button>;
                })}
            </Box>
            <Box className={classes.root}>
                <GoogleSignInButton />
            </Box>
        </>
    );
};

export default TemplatePage;
