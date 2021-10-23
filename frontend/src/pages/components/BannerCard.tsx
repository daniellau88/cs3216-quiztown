import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { setAutomatedQuiz } from '../../modules/quiz/operations';
import { CollectionMiniEntity } from '../../types/collections';
import { QuizData } from '../../types/quiz';
import colours from '../../utilities/colours';
import routes from '../../utilities/routes';
import { handleApiRequest } from '../../utilities/ui';
import { UndoneCardsMap } from '../HomePage';

import CollectionToggle from './CollectionToggle';

const useStyles = makeStyles(() => ({
    mainCard: {
        display: 'flex',
        borderRadius: '20px',
        width: '100%',
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
        height: '6vh',
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
    isMiniBanner?: boolean;
}

type Props = OwnProps;

const BannerCard: React.FC<Props> = (props: Props) => {
    const undoneCardsMaps = props.undoneCardsMaps;

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [collectionCount, setCollectionCount] = React.useState<number>(0);

    const totalUndone: number = undoneCardsMaps.filter(map => !map.inactive).reduce((prev, curr) => prev + curr.cards.length, 0);

    const onUpdate = (didActivate: boolean) => {
        setCollectionCount(collectionCount + (didActivate ? 1 : -1));
    };

    const startQuiz = () => {
        const cardIds = undoneCardsMaps.flatMap(undoneCardsMap => undoneCardsMap.cards).map(cardMiniEntity => cardMiniEntity.id);
        const quizData: QuizData = {
            cardIds: cardIds,
        };
        dispatch(setAutomatedQuiz(quizData)).then(() => {
            history.push(generatePath(routes.QUIZ));
        });
    };

    React.useEffect(() => {
        props.onChange();
    }, [props, collectionCount]);

    React.useEffect(() => {
        setCollectionCount([...undoneCardsMaps].filter(map => !map.inactive).filter(map => map.cards.length > 0).length);
    }, [undoneCardsMaps]);

    return (
        <>
            <Card className={classes.mainCard}>
                <CardContent className={classes.cardContent}>
                    <Box display='flex' height='100%' width='100%' flexDirection='row'>
                        <Grid className={classes.mainGrid}>
                            {!props.isMiniBanner ? (
                                <>
                                    <Typography className={classes.headerText}>
                                        You have {totalUndone} card{totalUndone == 1 ? '' : 's'} from {collectionCount} collection{collectionCount == 1 ? '' : 's'} to revisit today!
                                    </Typography>
                                    <Typography className={classes.subheaderText}>
                                        Click to activate or deactivate collections to customise your learning!
                                    </Typography>
                                </>
                            ) : (
                                <Box display='flex' width='100%' justifyContent='center' alignItems='center' paddingTop='1vh'>
                                    <Typography className={classes.subheaderText} align='center'>
                                        You have {totalUndone} card{totalUndone == 1 ? '' : 's'} from {collectionCount} collection{collectionCount == 1 ? '' : 's'} to revisit for this day!
                                    </Typography>
                                </Box>
                            )}
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
                            <Button className={classes.sideGridButton} onClick={startQuiz}>
                                <Typography className={classes.sideButtonText}>
                                    Start Learning
                                </Typography>
                            </Button>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
};

export default BannerCard;
