import {
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Moment from 'moment';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { CardEntity, CardPostData } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { addDays, roundDownDay } from '../../../utilities/datetime';
import { Feedback, getFeedbackSet } from '../../../utilities/leitner';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '20px',
    },
    imageContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    showAnswerContainer: {
        alignSelf: 'center',
        marginTop: '20px',
    },
    showAnswer: {
        fontSize: '1.5vh',
        height: '100%',
        width: '10vw',
        borderRadius: '10px',
        border: '1px solid black',
    },
    text: {
        fontSize: '5vh',
    },
    mainGrid: {
        rowGap: '20px',
    },
    buttonGap: {
        columnGap: '40px',
    },
    textAnswer: {
        fontSize: '5vh',
        color: colours.WHITE + '00',
    },
    fullWidth: {
        width: '100%',
    },
    card: {
        width: '95%',
        justifyContent: 'center',
    },
    cardContent: {
        width: '100%',
    },
    green: {
        color: colours.GREEN,
    },
    yellow: {
        color: colours.YELLOW,
    },
    red: {
        color: colours.RED,
    },
}));

interface CardTextProps {
    isEditing: boolean
    card: CardEntity
    onComplete?: () => void
}

const CardText: React.FC<CardTextProps> = ({
    isEditing,
    card,
    onComplete = () => { return; },
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const boxNumber = card.box_number;

    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [timeTaken, setTimeTaken] = useState<number>(0);

    const startTime = Moment();

    const stopTime = async () => {
        const endTime = Moment();
        setTimeTaken(Moment.duration(endTime.diff(startTime)).seconds());
    };

    const revealAllAnswers = () => {
        stopTime().then(() => setHasAnsweredAll(true));
    };

    const sendUpdate = (feedback: Feedback) => {
        if (!card || !feedback) {
            return false;
        }
        const cardPostData: Partial<CardPostData> = {
            ...card,
            box_number: feedback.nextBoxNumber,
            next_date: Moment(roundDownDay(addDays(new Date(), feedback.intervalLength))).format('YYYY-MM-DD'),
        };
        return handleApiRequest(dispatch, dispatch(updateCard(card.id, cardPostData)))
            .then(() => {
                onComplete ? onComplete() : history.goBack();
                return true;
            });
    };

    return (
        <>
            <CssBaseline />
            <Grid container direction='column' className={classes.root}>
                <Grid container direction='column' spacing={2} alignItems='center' className={classes.mainGrid}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid container item alignItems='center' className={classes.fullWidth}>
                                <Grid container item alignItems='center' className={classes.fullWidth}>
                                    Question
                                </Grid>
                                <Typography align='center' className={classes.text}>
                                    {card?.question}
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid container item alignItems='center' className={classes.fullWidth}>
                                <Grid container item alignItems='center' className={classes.fullWidth}>
                                    Answer
                                </Grid>
                                <Typography align='center' className={hasAnsweredAll ? classes.text : classes.textAnswer}>
                                    {card?.answer}
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container item direction='column' alignItems='center' className={classes.buttonGap}>
                        {!hasAnsweredAll && (
                            <Button
                                className={classes.showAnswer}
                                onClick={() => revealAllAnswers()}
                            >
                                Show Answer
                            </Button>
                        )}
                        {hasAnsweredAll && (
                            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                                <Typography>
                                    How confident did you feel?
                                </Typography>
                                <Box display='flex' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                                    {getFeedbackSet(timeTaken, 0, 0, 0, boxNumber).map((feedback: Feedback, index: number) => {
                                        return <Button key={index} onClick={() => sendUpdate(feedback)} className={index == 0 ? classes.red : index == 1 ? classes.yellow : classes.green}>
                                            <Grid container alignItems='center' justifyContent='center' direction='column'>
                                                {index == 0 ? <SentimentVeryDissatisfiedIcon /> : index == 1 ? <SentimentSatisfiedIcon /> : <SentimentVerySatisfiedIcon />}
                                                <Typography align='center'>
                                                    You&apos;ll see this card<br /> again in {feedback.intervalLength} day{feedback.intervalLength == 1 ? '' : 's'}.
                                                </Typography>
                                            </Grid>
                                        </Button>;
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid >
            </Grid>
        </>
    );
};

export default CardText;
