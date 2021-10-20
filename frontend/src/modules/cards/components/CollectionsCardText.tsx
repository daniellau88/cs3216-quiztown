import { Button, Card, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { CardEntity } from '../../../types/cards';
import { CollectionMiniEntity } from '../../../types/collections';
import { EntitySelection } from '../../../types/store';
import colours from '../../../utilities/colours';
import { dateToISOFormat } from '../../../utilities/datetime';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingBottom: '8vh',
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

interface OwnProps {
    collectionId: number;
    cardId: number;
    card: EntitySelection<CardEntity>;
    collection?: EntitySelection<CollectionMiniEntity>

}

type Props = OwnProps;

const CollectionsCardText: React.FC<Props> = ({ collectionId, cardId, card }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const [showAnswer, setShowAnswer] = React.useState(false);

    // TODO: change fix box number and next date to match the three buttons
    const nextBoxNumber = 1;
    const nextDate = new Date();

    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const onCardCompleted = (nextBoxNumber: number, nextDate: Date) => {
        handleApiRequest(dispatch, dispatch(updateCard(cardId, {
            box_number: nextBoxNumber,
            next_date: dateToISOFormat(nextDate),
        }))).finally(() => {
            // TODO: change the redirect below
            history.push(`/collections/${collectionId}`);
        });
    };

    return (
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
                        <Typography align='center' className={showAnswer ? classes.text : classes.textAnswer}>
                            {card?.answer}
                        </Typography>
                    </Grid>
                </CardContent>
            </Card>
            <Grid container item direction='column' alignItems='center' className={classes.buttonGap}>
                <Button
                    className={showAnswer ? classes.showAnswerGreyout : classes.showAnswerEnabled}
                    onClick={() => toggleShowAnswer()}
                >
                    Show Answer
                </Button>
                <Button
                    className={classes.showAnswerEnabled}
                    onClick={() => onCardCompleted(nextBoxNumber, nextDate)}
                >
                    Done
                </Button>
            </Grid>
        </Grid >
    );

};


export default CollectionsCardText;
