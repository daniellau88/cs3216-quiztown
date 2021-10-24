import { Box, CssBaseline, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, generatePath } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import Breadcrumbs from '../../../layouts/Breadcrumbs';
import { CardType } from '../../../types/cards';
import { AppState } from '../../../types/store';
import routes from '../../../utilities/routes';
import { handleApiRequests } from '../../../utilities/ui';
import { loadCollection } from '../../collections/operations';
import { getCollectionMiniEntity } from '../../collections/selectors';
import CollectionsCardImage from '../components/CollectionsCardImage';
import CollectionsCardText from '../components/CollectionsCardText';
import { loadCard } from '../operations';
import { getCardEntity } from '../selectors';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
    },
}));

type Props = RouteComponentProps;

const CollectionsCardShowPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, collectionId));
    const card = useSelector((state: AppState) => getCardEntity(state, cardId));

    const [isLoading, setIsLoading] = React.useState(true);

    console.log(card);

    const onUpdate = (cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequests(dispatch, dispatch(loadCard(cardId)), dispatch(loadCollection(collectionId))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate(cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: routes.COLLECTIONS.INDEX, name: 'Collections' },
                        { path: generatePath(routes.COLLECTIONS.SHOW, { collectionId: collectionId }), name: collection ? collection.name : 'Untitled collection' },
                        { path: null, name: card ? card.name : 'Untitled Card' },
                    ]} />
                    {isLoading && (
                        <LoadingIndicator />
                    )}
                    {!isLoading && card && (card.type == CardType.TEXT ?
                        <CollectionsCardText
                            collectionId={collectionId}
                            cardId={cardId}
                            card={card}
                            collection={collection}
                        />
                        :
                        <CollectionsCardImage
                            collectionId={collectionId}
                            cardId={cardId}
                            card={card}
                            collection={collection}
                        />
                    )}
                </Grid>
            </Box>
        </>
    );

};

export default CollectionsCardShowPage;
