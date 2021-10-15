import {
    Box,
    CssBaseline,
    Grid,
    Input,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import api from '../../../api';
import QTButton from '../../../components/QTButton';
import { CollectionPostData, CollectionsImportPostData } from '../../../types/collections';
import { UploadData } from '../../../types/uploads';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionAddFileCards from '../components/CollectionAddFileCards';
import { addCollection, importCollections } from '../operations';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingTop: '40px',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 60,
    },
    title: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
    },
    input: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(0),
        flex: 1,
    },
    button: {
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const AddCollectionPage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [collectionName, setCollectionName] = useState<string>('Untitled collection');
    const [uploadFiles, setUploadedResponse] = useState<Array<UploadData>>([]);

    const createCollection = () => {
        if (uploadFiles == undefined) {
            return;
        }
        // TODO: change owner_id: user ? user.id : 0
        const collectionPostDataCurrent: CollectionPostData = { name: collectionName, owner_id: 0 };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)))
            .then((response) => {
                console.log(response);
                return handleApiRequest(dispatch, dispatch(importCollections(response.payload.id, { imports: uploadFiles }))).then((importResponse) => {
                    const payload = importResponse.payload;
                    console.log(payload);
                    // Redirect to home page
                    // history.push('/collections');
                });
            })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    };

    const handleCollectionNameChange = (e: React.ChangeEvent<any>) => {
        const newName = e.target.value;
        setCollectionName(newName);
    };

    const reviewCollection = () => {
        console.log('review collection..');
        createCollection();
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid container direction='row' className={classes.header}>
                        <Typography className={classes.title} variant='h5' component="div">
                            Adding files to
                        </Typography>
                        <Input className={classes.input}
                            onChange={handleCollectionNameChange}
                            value={collectionName}
                            placeholder="Untitled Collection" />
                    </Grid>
                    <CollectionAddFileCards setUploadedResponse={setUploadedResponse} />
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={reviewCollection}>Review Collection</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default AddCollectionPage;