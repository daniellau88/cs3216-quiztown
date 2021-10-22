import {
    Button,
    CssBaseline,
    Divider,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath, useHistory } from 'react-router-dom';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CollectionPostData } from '../../../types/collections';
import { AppState } from '../../../types/store';
import colours from '../../../utilities/colours';
import routes from '../../../utilities/routes';
import { handleApiRequest } from '../../../utilities/ui';
import { loadCollectionImportCards } from '../../cards/operations';
import { addCollection, loadCollection } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';
import CollectionReviewCard from '../components/CollectionReviewCard';
import CollectionReviewCardSelector from '../components/CollectionReviewCardSelector';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '80px',
    },
    fullHeight: {
        height: '100%',
    },
    reviewSelectorContainer: {
        position: 'relative',
        marginTop: '20px',
        borderRadius: 5,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
        width: '80vw',
        height: '20vh',
    },
    sideGridButton: {
        height: '100%', 
        width: '100%',
        backgroundColor: colours.BLUE,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: colours.LIGHTBLUE,
        },
    },
    sideButtonText: {
        fontSize: isBrowser ? '3vh' : '2vh',
        color: colours.WHITE,
    },
}));

type Props = RouteComponentProps;

const CollectionReviewPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState(true);
    const [importedCardIds, setImportedCardIds] = React.useState<number[]>();
    const [currCardId, setCurrCardId] = React.useState<number>();

    const collectionId: string = (params as { collectionId: string }).collectionId;
    const importId: string = (params as { importId: string }).importId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, parseInt(collectionId)));

    React.useEffect(() => {
        handleApiRequest(dispatch, dispatch(loadCollection(parseInt(collectionId))))
            .finally(() => {
                setIsLoading(false);
            })
            .catch(() => {
                history.replace('/collections');
            });
        handleApiRequest(dispatch, dispatch(loadCollectionImportCards(parseInt(importId), {})))
            .then(res => {
                const cardIds = res.payload.ids;
                setImportedCardIds(cardIds);

                if (cardIds.length > 0) {
                    setCurrCardId(cardIds[0]);
                }
            });
    }, []);

    const completeReview = () => {
        const collectionPostDataCurrent: CollectionPostData = { name: 'Random' };
        return handleApiRequest(dispatch, dispatch(addCollection(collectionPostDataCurrent)));
    };

    const selectCard = (selectedCardId:number) => {

        setCurrCardId(selectedCardId);
    };

    if (isLoading) return <LoadingIndicator />;

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
                    <Grid
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                        spacing={4}
                    >
                        <Grid item>
                            <Grid 
                                container
                                direction='row'
                                alignItems='center'
                                className={classes.reviewSelectorContainer}
                            >
                                <Grid item xs={10} className={classes.fullHeight}>
                                    <CollectionReviewCardSelector 
                                        cardIds={importedCardIds || []}
                                        currCardId={currCardId}
                                        onSelect={selectCard}
                                    />
                                </Grid>
                                <Grid item xs={2} className={classes.fullHeight}>
                                    <Button className={classes.sideGridButton} onClick={completeReview}>
                                        <Typography className={classes.sideButtonText}>
                                            Confirm all
                                        </Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <CollectionReviewCard cardId={currCardId}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default CollectionReviewPage;
