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
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CollectionPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import { UploadData } from '../../../types/uploads';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionAddFileCards from '../components/CollectionAddFileCards';
import { addCollection, importCollections } from '../operations';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        paddingBottom: '80px',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    title: {
        marginLeft: theme.spacing(1),
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
    description: {
        marginLeft: theme.spacing(1),
        paddingBottom: '5vh',
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
        const collectionPostDataCurrent: CollectionPostData = { name: collectionName };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)))
            .then((response) => {
                handleApiRequest(dispatch, dispatch(importCollections(response.payload.id, { imports: uploadFiles })));
            })
            .finally(() => {
                history.push('/collections');
            });
    };

    const handleCollectionNameChange = (e: React.ChangeEvent<any>) => {
        const newName = e.target.value;
        setCollectionName(newName);
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: null, name: 'Add Collection' },
                    ]} />
                    <Grid container direction='row' className={classes.header}>
                        <Typography className={classes.title} variant='h5' component="div">
                            Adding files to
                        </Typography>
                        <Input className={classes.input}
                            onChange={handleCollectionNameChange}
                            value={collectionName}
                            placeholder="Untitled Collection" />
                    </Grid>
                    <Typography variant='body1' component="div" className={classes.description}>
                        Upload files to automatically generate cards! We will notify you when they are ready for your review.
                    </Typography>
                    <CollectionAddFileCards setUploadedResponse={setUploadedResponse} />
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={createCollection}>Done</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default AddCollectionPage;
