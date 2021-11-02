import {
    Box,
    ButtonProps,
    Card,
    CardContent,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';

import { CollectionMiniEntity } from '../../types/collections';
import colours from '../../utilities/colours';
import { UndoneCardsMap } from '../HomePage';

import CollectionToggle from './CollectionToggle';
import StartQuizButton from './StartQuizButton';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCard: {
        display: 'flex',
        borderRadius: '20px',
        height: 'auto',
        width: isBrowser ? '80%' : '95%',
    },
    mainGrid: {
        height: '100%',
        width: '80%',
    },
    sideGrid: {
        height: '100%',
        width: '20%',
    },
    cardContent: {
        marginLeft: '2vw',
        width: '100%',
        padding: 0,
        '&:last-child': {
            paddingBottom: 0,
        },
    },
    headerText: {
        fontSize: isBrowser ? '4vh' : '3vh',
        paddingTop: '2vh',
        paddingBottom: isBrowser ? '3vh' : '2vh',
        paddingRight: '2vw',
    },
    subheaderText: {
        fontSize: '2vh',
        paddingBottom: '2vh',
        paddingRight: '2vw',
    },
    collectionCards: {
        width: '100%',
        marginBottom: '2vh',
    },
    sideGridButton: {
        height: '100%',
        width: '100%',
        backgroundColor: colours.BLUE,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: colours.LIGHTBLUE,
        },
        '&:disabled': {
            backgroundColor: colours.GREY,
        },
    },
    sideButtonText: {
        fontSize: isBrowser ? '3vh' : '2vh',
        color: colours.WHITE,
    },
    link: {
        color: colours.BLUE,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

interface OwnProps {
    undoneCardsMaps: UndoneCardsMap[];
    collections: CollectionMiniEntity[];
    onChange: () => void;
}

type Props = OwnProps;

const BannerCard: React.FC<Props> = (props: Props) => {
    const undoneCardsMaps = props.undoneCardsMaps;

    const classes = useStyles();
    const [collectionCount, setCollectionCount] = React.useState<number>(0);

    const totalUndone: number = undoneCardsMaps.filter(map => !map.inactive).reduce((prev, curr) => prev + curr.cards.length, 0);
    const cardIds = undoneCardsMaps.filter(map => !map.inactive).flatMap(undoneCardsMap => undoneCardsMap.cards).map(cardMiniEntity => cardMiniEntity.id);

    const onUpdate = (didActivate: boolean) => {
        setCollectionCount(collectionCount + (didActivate ? 1 : -1));
    };

    React.useEffect(() => {
        props.onChange();
    }, [props, collectionCount]);

    React.useEffect(() => {
        setCollectionCount([...undoneCardsMaps].filter(map => !map.inactive).filter(map => map.cards.length > 0).length);
    }, [undoneCardsMaps]);

    const ButtonComponent = (props: ButtonProps) => {
        return (
            <button className={classes.sideGridButton} {...props} >
                <Typography className={classes.sideButtonText}>
                    Start Learning
                </Typography>
            </button>
        );
    };

    return (
        <Box className={classes.root}>
            <Card className={classes.mainCard}>
                <CardContent className={classes.cardContent}>
                    <Box display='flex' height='100%' width='100%' flexDirection='row'>
                        <Grid className={classes.mainGrid}>
                            <Typography className={classes.headerText}>
                                You have {totalUndone} card{totalUndone == 1 ? '' : 's'} from {collectionCount} collection{collectionCount == 1 ? '' : 's'} to revisit!
                            </Typography>
                            <Typography className={classes.subheaderText}>
                                Click to activate or deactivate collections to customise your learning!
                            </Typography>
                            <Grid container className={classes.collectionCards}>
                                {props.undoneCardsMaps.map((undoneCardsMap) => {
                                    return <CollectionToggle
                                        key={undoneCardsMap.collectionId}
                                        collectionName={props.collections.filter(collection => collection.id == undoneCardsMap.collectionId)[0].name}
                                        undoneCardsMap={undoneCardsMap}
                                        onChange={(didActivate) => onUpdate(didActivate)}
                                    />;
                                })}
                            </Grid>
                        </Grid>
                        <Grid className={classes.sideGrid}>
                            <StartQuizButton buttonComponent={ButtonComponent} cardIds={cardIds} disabled={totalUndone <= 0} />
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BannerCard;
