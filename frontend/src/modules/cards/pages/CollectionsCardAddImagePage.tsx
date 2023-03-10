import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { AppState } from '../../../types/store';
import { UploadData } from '../../../types/uploads';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionAddFileCards from '../../collections/components/CollectionAddFileCards';
import { importCollections } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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
    description: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
        paddingTop: '2vh',
    },
}));

type Props = RouteComponentProps;

const CollectionsCardAddImagePage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [uploadFiles, setUploadedResponse] = useState<Array<UploadData>>([]);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const collectionId: number = +(params as { collectionId: string }).collectionId;

    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));

    const createCollection = () => {
        if (uploadFiles == undefined) {
            return;
        }
        return handleApiRequest(dispatch, dispatch(importCollections(collectionId, { imports: uploadFiles }))).then((importResponse) => {
            history.push(`/collections/${collectionId}`);
        });
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
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                        { path: null, name: 'Add Image Card' },
                    ]} />
                    <Grid container direction='column' className={classes.header}>
                        <Typography className={classes.title} variant='h5' component="div">
                            Import cards to {collection?.name}
                        </Typography>
                        <Typography variant='body1' component="div" className={classes.description}>
                            Upload files to automatically generate cards! We will notify you when they are ready for your review.
                        </Typography>
                    </Grid>
                    <CollectionAddFileCards setUploadedResponse={setUploadedResponse} setButtonDisabled={setButtonDisabled} />
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={reviewCollection} disabled={buttonDisabled}>Done</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default CollectionsCardAddImagePage;
