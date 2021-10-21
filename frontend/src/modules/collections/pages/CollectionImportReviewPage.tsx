import {
    CssBaseline,
    Divider,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import QTButton from '../../../components/QTButton';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CollectionPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionReviewCardSelector from '../components/CollectionReviewCardSelector';
import { addCollection, loadCollection } from '../operations';
import { getCollectionMiniEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '80px',
    },
    left: {
        justifySelf: 'flex-start',
    },
    right: {
        alignSelf: 'flex-start',
    },
    arrowIcon: {
        fontSize: '15vh',
    },
}));

type Props = RouteComponentProps;

const CollectionReviewPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const collectionId: string = (params as { collectionId: string }).collectionId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, parseInt(collectionId)));

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        handleApiRequest(dispatch, dispatch(loadCollection(parseInt(collectionId))))
            .then(res => {
                // Get import data
            })
            .finally(() => {
                setIsLoading(false);
            })
            .catch(() => {
                // history.replace('/collections');
            });
    }, []);

    const previousCard = () => {
        console.log('previous card');
    };

    const nextCard = () => {
        console.log('next card');
    };

    const completeReview = () => {
        const collectionPostDataCurrent: CollectionPostData = { name: 'Random' };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)));
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <CssBaseline />
            <Grid container spacing={2} className={classes.root} direction='column'>
                <Breadcrumbs links={[
                    { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                    { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                    { path: null, name: 'Review' },
                ]} />
                <Typography align='center' variant='h3'>
                    Reviewing Cards for {collection && collection.name}
                </Typography>
                <Divider/>

                <Grid container justifyContent='center' alignItems='center'>
                    <Grid container direction='column' justifyContent='center' alignItems='center'>
                        <Grid item>
                            Card image
                            {/* <CardImage
                                    card={card}
                                    isEditing={true}
                                /> */}
                        </Grid>
                        <Grid item>
                            <Grid container direction='row' alignItems='center' spacing={6}>
                                <Grid item xs={10}>
                                    <CollectionReviewCardSelector />
                                </Grid>
                                <Grid item xs={2}>
                                    <QTButton outlined onClick={completeReview}>Confirm all</QTButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default CollectionReviewPage;
