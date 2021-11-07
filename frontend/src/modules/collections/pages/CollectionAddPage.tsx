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

import QTButton from '../../../components/QTButton';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CollectionPostData } from '../../../types/collections';
import { UploadData } from '../../../types/uploads';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionAddFileCards from '../components/CollectionAddFileCards';
import CollectionTagSelector from '../components/CollectionTagSelector';
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
    const tagSelectorRef = React.useRef<string[]>([]);

    const [collectionName, setCollectionName] = useState<string>('Untitled collection');
    const [uploadFiles, setUploadedResponse] = useState<Array<UploadData>>([]);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const createCollection = () => {
        if (uploadFiles == undefined) {
            return;
        }

        const collectionPostDataCurrent: CollectionPostData = { name: collectionName };

        if (tagSelectorRef && tagSelectorRef.current) {
            console.log(tagSelectorRef.current);
            collectionPostDataCurrent.tags = tagSelectorRef.current;
        }

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
                    <Grid container item direction='row' alignItems='center' className={classes.header}>
                        <Grid container item xs={9} wrap='nowrap'>
                            <Grid container alignItems='center'>
                                <Typography className={classes.title} variant='h5' component="div">
                                    Adding files to
                                </Typography>
                                <Input className={classes.input}
                                    onChange={handleCollectionNameChange}
                                    value={collectionName}
                                    placeholder="Untitled Collection" />
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <CollectionTagSelector
                                collectionData={{ tags: [] }}
                                tagSelectorRef={tagSelectorRef}
                            />
                        </Grid>
                    </Grid>
                    <Typography variant='body1' component="div" className={classes.description}>
                        Upload files to automatically generate cards! We will notify you when they are ready for your review.
                    </Typography>
                    <CollectionAddFileCards setUploadedResponse={setUploadedResponse} setButtonDisabled={setButtonDisabled} />
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={createCollection} disabled={buttonDisabled}>Done</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default AddCollectionPage;
