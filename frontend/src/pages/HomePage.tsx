import {
    Box,
    CssBaseline,
    Typography,
    makeStyles,
} from '@material-ui/core';
import Moment from 'moment';
import * as React from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';
import { useDispatch, useSelector } from 'react-redux';
import { Link, generatePath } from 'react-router-dom';

import LoadingIndicator from '../components/content/LoadingIndicator';
import { loadAllCards } from '../modules/cards/operations';
import { getAllCards, getCardMiniEntity } from '../modules/cards/selectors';
import { loadAllCollections } from '../modules/collections/operations';
import { getAllCollections, getCollectionMiniEntity } from '../modules/collections/selectors';
import { CardMiniEntity } from '../types/cards';
import { CollectionMiniEntity } from '../types/collections';
import { AppState, EntityCollection } from '../types/store';
import colours from '../utilities/colours';
import { addDays, dateToISOFormat, roundDownDay } from '../utilities/datetime';
import { multiselect } from '../utilities/multiselect';
import routes from '../utilities/routes';
import { handleApiRequests } from '../utilities/ui';

import BannerCard from './components/BannerCard';
import '../assets/css/timeline.css';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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

export interface UndoneCardsMap {
    collectionId: number,
    cards: CardMiniEntity[],
    inactive?: boolean,
}

const HomePage: React.FC<{}> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [days, setDays] = React.useState<number>(0);

    const allCollections: EntityCollection = useSelector(getAllCollections);
    const collectionIds = allCollections.ids;

    const collectionsHash: any = useSelector((state: AppState) =>
        multiselect(getCollectionMiniEntity, state, collectionIds),
    );

    const collections: CollectionMiniEntity[] = [];
    for (const c in collectionsHash) {
        collections.push(collectionsHash[c]);
    }

    const allCards: EntityCollection = useSelector(getAllCards);
    const cardIds = allCards.ids;

    const cardsHash: any = useSelector((state: AppState) =>
        multiselect(getCardMiniEntity, state, cardIds),
    );

    const cards: CardMiniEntity[] = [];
    for (const c in cardsHash) {
        cards.push(cardsHash[c]);
    }

    const undoneCardsMaps: UndoneCardsMap[] = [];
    for (const c of collectionIds) {
        undoneCardsMaps.push({ collectionId: c, cards: cards.filter(card => card.collection_id == c) }); // TODO add date filter
    }

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const undoneCardFilter = {
            next_date: {
                end: dateToISOFormat(Moment().add(7, 'days').toDate()),
            },
        };
        handleApiRequests(
            dispatch,
            dispatch(loadAllCollections({})),
            dispatch(loadAllCards({ filters: undoneCardFilter })),
        ).finally(() => setIsLoading(false));
    }, [dispatch]);

    // TODO remove debug tool once workflow (to start quiz) is complete
    const onUpdate = () => {
        console.log(undoneCardsMaps);
    };
    const TIMELINE_VALUES = [0, 1, 2, 3, 4, 5, 6].map(days => Moment().add(days, 'days').format());

    const undoneCardsPerDayMaps: UndoneCardsMap[][] = [];
    for (let i = 0; i < 8; i++) {
        const undoneCardsMaps: UndoneCardsMap[] = [];
        const day = roundDownDay(addDays(new Date(), i));
        for (const c of collections.map(c => c.id)) {
            undoneCardsMaps.push({ collectionId: c, cards: cards.filter(card => card.collection_id == c).filter(card => Moment(card.next_date).diff(Moment(day)) < 0) });
        }
        undoneCardsPerDayMaps.push(undoneCardsMaps);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    React.useEffect(() => {
    }, [days]);

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
            <Box display='flex' flexDirection='column' className={classes.root}>
                <Box style={{ height: '10vh', width: '80%', margin: '0 auto' }}>
                    <HorizontalTimeline
                        index={days}
                        linePadding={60}
                        maxEventPadding={80}
                        indexClick={(index: number) => {
                            setDays(index);
                        }}
                        values={TIMELINE_VALUES} />
                </Box>
                <BannerCard
                    undoneCardsMaps={undoneCardsPerDayMaps[days]}
                    collections={collections}
                    onChange={() => { return; }}
                />
            </Box>
        </>
    );
};

export default HomePage;
