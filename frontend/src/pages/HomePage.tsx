import {
    Box,
    CssBaseline,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, generatePath } from 'react-router-dom';

import LoadingIndicator from '../components/content/LoadingIndicator';
import { loadAllCollections, loadCollectionContents, loadCollectionsCard } from '../modules/collections/operations';
import { getAllCollections, getCollectionMiniEntity, getCollectionsCardList, getCollectionsCardMiniEntity } from '../modules/collections/selectors';
import { CollectionMiniEntity, CollectionsCardMiniEntity } from '../types/collections';
import { AppState, EntityCollection } from '../types/store';
import colours from '../utilities/colours';
import { multiselect } from '../utilities/multiselect';
import routes from '../utilities/routes';
import { handleApiRequest, handleApiRequests } from '../utilities/ui';

import BannerCard from './components/BannerCard';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '80px',
    },
    mainCard: {
        display: 'flex',
        borderRadius: '20px',
        width: '100%',
    },
    cardContent: {
        paddingLeft: '2vw',
    },
    headerText: {
        fontSize: '4vh',
    },
    link: {
        color: colours.BLUE,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

interface CardIdMap {
    collectionId: number,
    cards: number[],
}

export interface UndoneCardsMap {
    collectionId: number,
    cards: CollectionsCardMiniEntity[],
    inactive?: boolean,
}

const HomePage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const allCollections: EntityCollection = useSelector(getAllCollections);
    const ids = allCollections.ids;

    const collectionsHash: any = useSelector((state: AppState) =>
        multiselect(getCollectionMiniEntity, state, ids),
    );

    const collections: CollectionMiniEntity[] = [];
    for (const c in collectionsHash) {
        collections.push(collectionsHash[c]);
    }

    const collectionsCardsHash: any = useSelector((state: AppState) =>
        multiselect(getCollectionsCardList, state, ids),
    );

    const collectionsCards: EntityCollection[] = [];
    for (const c in collectionsCardsHash) {
        collectionsCards.push(collectionsCardsHash[c]);
    }

    const cardIdSet: Set<number> = new Set();
    const cardIdMaps: CardIdMap[] = [];
    for (const c in collectionsCards) {
        const idMap: number[] = [];
        for (const cid of collectionsCards[c].ids) {
            idMap.push(Number(cid));
            cardIdSet.add(Number(cid));
        }
        cardIdMaps.push({ collectionId: ids[c], cards: idMap });
    }
    const cardIds = Array.from(cardIdSet);

    const cardsHash: any = useSelector((state: AppState) =>
        multiselect(getCollectionsCardMiniEntity, state, cardIds),
    );

    const cards: CollectionsCardMiniEntity[] = [];
    for (const c in cardsHash) {
        cards.push(cardsHash[c]);
    }

    const undoneCardsMaps: UndoneCardsMap[] = [];
    for (const c of ids) {
        undoneCardsMaps.push({ collectionId: c, cards: cards.filter(card => card.collection_id == c) }); // TODO add date filter
    }

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadAllCollections({})))
            .finally(() => setIsLoading(false));
    }, [dispatch]);

    React.useEffect(() => {
        setIsLoading(true);
        const requests = [];
        for (const c of collections) {
            requests.push(dispatch(loadCollectionContents(c.id, {})));
        }
        handleApiRequests(dispatch, ...requests)
            .finally(() => setIsLoading(false));
    }, [collections.length]);

    React.useEffect(() => {
        setIsLoading(true);
        const requests = [];
        for (const cardIdMap of cardIdMaps) {
            for (const cardId of cardIdMap.cards) {
                requests.push(dispatch(loadCollectionsCard(cardIdMap.collectionId, cardId)));
            }
        }
        handleApiRequests(dispatch, ...requests)
            .finally(() => setIsLoading(false));
    }, [cardIdMaps.length]);

    // TODO remove debug tool once workflow (to start quiz) is complete
    const onUpdate = () => {
        console.log(undoneCardsMaps);
    };

    if (isLoading) {
        return <LoadingIndicator></LoadingIndicator>;
    }

    if (collections.length == 0) {
        return (
            <>
                <CssBaseline />
                <Box className={classes.root}>
                    <Typography className={classes.headerText}>
                        You have no collections at the moment! Click&nbsp;
                        <Link to={generatePath(routes.COLLECTIONS.NEW)} className={classes.link}>
                            here
                        </Link> to add one.
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <BannerCard undoneCardsMaps={undoneCardsMaps} collections={collections} onChange={onUpdate} />
            </Box>
        </>
    );
};

export default HomePage;
