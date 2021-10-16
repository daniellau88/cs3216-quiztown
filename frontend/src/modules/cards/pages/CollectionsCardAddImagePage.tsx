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
import { RouteComponentProps, useHistory } from 'react-router-dom';

import QTButton from '../../../components/QTButton';
import { AppState } from '../../../types/store';
import { UploadData } from '../../../types/uploads';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionAddFileCards from '../../collections/components/CollectionAddFileCards';
import { importCollections } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';
import { loadCollectionCards } from '../operations';

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

type Props = RouteComponentProps;

const CollectionsCardAddImagePage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [uploadFiles, setUploadedResponse] = useState<Array<UploadData>>([]);

    const collectionId: number = +(params as { collectionId: string }).collectionId;

    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));

    const createCollection = () => {
        if (uploadFiles == undefined) {
            return;
        }
        return handleApiRequest(dispatch, dispatch(importCollections(collectionId, { imports: uploadFiles }))).then((importResponse) => {
            const payload = importResponse.payload;
            console.log(payload);
            // TODO: Redirect to preview page
            // history.push(`/collections/${payload.collection_id}/cards/${payload.id}`);

            // currently it directs back to card list page for that collection
            return handleApiRequest(dispatch, dispatch(loadCollectionCards(collectionId, {}))).finally(() => {
                history.push(`/collections/${collectionId}`);
            });
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
                    <Grid container direction='row' className={classes.header}>
                        <Typography className={classes.title} variant='h5' component="div">
                            Adding files to {collection?.name}
                        </Typography>
                    </Grid>
                    <CollectionAddFileCards setUploadedResponse={setUploadedResponse} />
                    <Grid container direction='column' className={classes.button}>
                        <QTButton outlined onClick={reviewCollection}>Add to Collection</QTButton>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default CollectionsCardAddImagePage;
