import {
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
    showAnswerEnabled: {
        fontSize: '1.5vh',
        height: '100%',
        width: '10vw',
        borderRadius: '10px',
        border: '1px solid black',
    },
    showAnswerGreyout: {
        fontSize: '1.5vh',
        height: '100%',
        width: '10vw',
        borderRadius: '10px',
        border: '1px solid black',
        backgroundColor: colours.LIGHTGREY,
    },
    text: {
        fontSize: '5vh',
    },
    cardContent: {
        rowGap: '20px',
    },
    buttonGap: {
        columnGap: '40px',
    },
    textAnswer: {
        fontSize: '5vh',
        color: colours.WHITE,
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
                <Grid container direction='column' spacing={2} alignItems='center' className={classes.cardContent}>
                    <Card>
                        <CardContent>
                            <Grid container item alignItems='center'>
                                <Grid container item alignItems='center'>
                                    Question
                                </Grid>
                                <Typography align='center' className={classes.text}>
                                    {card?.question}
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Grid container item alignItems='center'>
                                <Grid container item alignItems='center'>
                                    Answer
                                </Grid>
                                <Typography align='center' className={hasAnsweredAll ? classes.text : classes.textAnswer}>
                                    {card?.answer}
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container item direction='column' alignItems='center' className={classes.buttonGap}>
                        <Button
                            className={hasAnsweredAll ? classes.showAnswerGreyout : classes.showAnswerEnabled}
                            onClick={() => revealAllAnswers()}
                        >
                            Show Answer
                        </Button>
                        <Typography>
                            How confident did you feel?
                        </Typography>
                        {getFeedbackSet(timeTaken, 0, 0, boxNumber).map((feedback: Feedback, index: number) => {
                            return <Button key={index} onClick={() => sendUpdate(feedback)}>
                                <Grid container alignItems='center' justifyContent='center' direction='column'>
                                    {index == 0 ? <SentimentVeryDissatisfiedIcon /> : index == 1 ? <SentimentSatisfiedIcon /> : <SentimentVerySatisfiedIcon />}
                                    <Typography align='center'>
                                        Interval: {feedback.intervalLength}
                                    </Typography>
                                </Grid>
                            </Button>;
                        })}
                    </Grid>
                </Grid >
            </Grid>
        </>
    );
};

export default CardText;
