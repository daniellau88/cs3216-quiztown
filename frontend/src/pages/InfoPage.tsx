import {
    Box,
    CssBaseline,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';

import colours from '../utilities/colours';
import routes from '../utilities/routes';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '80px',
    },
    headerText: {
        fontSize: '4vh',
        color: colours.BLUE,
    },
    subheaderText: {
        paddingTop: '1.5vh',
        fontSize: '3vh',
        color: colours.BLUE,
    },
    text: {
        paddingTop: '1vh',
        fontSize: '2vh',
    },
    link: {
        color: colours.BLUE,
        textDecoration: 'none',
        '&:hover': {
            color: colours.LIGHTBLUE,
        },
    },
}));

const InfoPage: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box display='flex' flexDirection='column' className={classes.root}>
                <Typography align='center' className={classes.headerText}>
                    Welcome to QuizTown!
                </Typography>
                <Typography className={classes.subheaderText}>
                    What&apos;s QuizTown?
                </Typography>
                <Typography className={classes.text}>
                    QuizTown is your flashcard assistant. We help you create and manage flashcards with a focus on efficiency.
                    We know that you&apos;re busy enough - so we want to make the process as quick and painless as possible.
                    QuizTown also maximises the efficacy of your learning by using spaced repetition, a proven learning approach
                    that helps integrate knowledge into your long-term memory.
                </Typography>
                <Typography className={classes.subheaderText}>
                    How do I use QuizTown?
                </Typography>
                <Typography className={classes.text}>
                    You can add collections in the collections page, and add or import cards into a collection from the&nbsp;
                    <Link to={routes.COLLECTIONS.INDEX} className={classes.link}>
                        collections
                    </Link> page. We&apos;ll handle all the interval tracking - you&apos;ll just need to go to the&nbsp;
                    <Link to={routes.ROOT} className={classes.link}>
                        homepage
                    </Link> each day and select
                    the collections you want to study that day, and you&apos;ll be able to do the cards in those collections which
                    intervals are due.
                </Typography>
                <Typography className={classes.subheaderText}>
                    What makes QuizTown different?
                </Typography>
                <Typography className={classes.text}>
                    In addition to supporting text-based flashcards like other flashcard programs,
                    QuizTown helps you make flashcards faster than ever by scanning your images and pdfs to automatically create
                    image-based question cards. You can then modify these cards to add or remove answer boxes before they are
                    added to your collection. When testing yourself with these cards, you can drag and drop answers into their boxes
                    to fill in the blanks.
                </Typography>
                <Typography className={classes.subheaderText}>
                    How does QuizTown use spaced repetition?
                </Typography>
                <Typography className={classes.text}>
                    QuizTown evaluates the time taken to do a card and the number of incorrect attempts to predict how proficient
                    you are with a card&apos;s content. Of course, we aren&apos;t always right, so we still offer 4 confidence
                    levels for you to choose from! The more confident you are with a card, the larger the interval before you see the
                    card again. If you&apos;re consistently confident in a card, this interval will continue increasing up to a maximum of 30 days.
                </Typography>
            </Box>
        </>
    );
};

export default InfoPage;
