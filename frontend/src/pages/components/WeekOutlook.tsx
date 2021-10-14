import {
    Box,
    Button,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import Moment from 'moment';
import * as React from 'react';

import { CardMiniEntity } from '../../types/cards';
import { CollectionMiniEntity } from '../../types/collections';
import { addDays, roundDownDay } from '../../utilities/datetime';
import { UndoneCardsMap } from '../HomePage';

import BannerCard from './BannerCard';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5vh',
    },
    headerText: {
        fontSize: '4vh',
        paddingBottom: '5vh',
    },
    dayGrid: {
        width: '10vw',
        marginLeft: '1vw',
        marginRight: '1vw',
        height: '8vh',
        border: '1px solid black',
        borderRadius: '5px',
    },
    button: {
        textTransform: 'none',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
    },
}));

interface OwnProps {
    collections: CollectionMiniEntity[];
    cards: CardMiniEntity[];
    onChange: () => void;
}

type Props = OwnProps;

const WeekOutlook: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [showingDays, setShowingDays] = React.useState<number>(0);


    const undoneCardsPerDayMaps: UndoneCardsMap[][] = [];
    for (let i = 1; i < 8; i++) {
        const undoneCardsMaps: UndoneCardsMap[] = [];
        const day = roundDownDay(addDays(new Date(), i));
        console.log(Moment(day).format('YYYY-MM-DD'));
        console.log(props.cards[1]?.next_date.toString());
        for (const c of props.collections.map(c => c.id)) {
            undoneCardsMaps.push({ collectionId: c, cards: props.cards.filter(card => card.collection_id == c).filter(card => card.next_date.toString() == Moment(day).format('YYYY-MM-DD')) });
        }
        undoneCardsPerDayMaps.push(undoneCardsMaps);
    }

    const handleClick = (addedDays: number) => {
        setShowingDays(addedDays);
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    React.useEffect(() => {
    }, [showingDays]);

    return (
        <>
            <Grid container className={classes.root}>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography className={classes.headerText}>
                        Here&apos;s your outlook for next week!
                    </Typography>
                    <Box display='flex' flexDirection='row' paddingBottom='2vh'>
                        {[1, 2, 3, 4, 5, 6, 7].map(addedDays => {
                            const day = roundDownDay(addDays(new Date(), addedDays));
                            const dateString = day.toDateString().split(' ');
                            const undoneCardsMaps = undoneCardsPerDayMaps[addedDays - 1];
                            const numCards = undoneCardsMaps.reduce((prev, curr) => prev + curr.cards.length, 0);
                            return <Grid container item key={addedDays} className={classes.dayGrid} justifyContent='center' alignItems='center'>
                                <Button className={classes.button} onClick={() => handleClick(addedDays)}>
                                    <Typography align='center'>
                                        {dateString[0]}, {dateString[1]} {dateString[2]}<br />
                                        {numCards} cards
                                    </Typography>
                                </Button>
                            </Grid>;
                        })}
                    </Box>
                    {showingDays > 0 && (
                        <BannerCard
                            undoneCardsMaps={undoneCardsPerDayMaps[showingDays - 1]}
                            collections={props.collections}
                            onChange={() => { return; }}
                            isMiniBanner={true}
                        />
                    )}
                </Box>
            </Grid>
        </>
    );
};

export default WeekOutlook;