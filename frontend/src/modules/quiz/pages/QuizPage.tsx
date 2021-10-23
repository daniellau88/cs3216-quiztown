import {
    Box,
    Card,
    CardContent,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { generatePath } from 'react-router-dom';

import Breadcrumbs from '../../../layouts/Breadcrumbs';
import routes from '../../../utilities/routes';
import QuizCard from '../components/QuizCard';
import { getAutomatedQuizEntity } from '../selectors';


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '80px',
        width: '100%',
    },
    mainCard: {
        display: 'flex',
        borderRadius: '20px',
        width: '100%',
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
}));

const QuizPage: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [done, setDone] = React.useState<boolean>(false);

    const quizEntity = useSelector(getAutomatedQuizEntity);
    const cardIds = quizEntity ? quizEntity.cardIds : [];
    const totalCards = cardIds.length;

    if (cardIds.length < 1) {
        history.push(generatePath(routes.ROOT));
    }

    const nextQuestion = () => {
        if (currentIndex + 1 < totalCards) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setDone(true);
        }
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Breadcrumbs links={[
                        { path: null, name: 'Quiz' },
                    ]} />
                    <Box display='flex' flexDirection='column' className={classes.root}>
                        <Card className={classes.mainCard}>
                            <CardContent className={classes.cardContent}>
                                <Box display='flex' height='100%' width='100%' flexDirection='row'>
                                    {!done ? (
                                        <QuizCard cardId={cardIds[currentIndex]} onComplete={nextQuestion} />
                                    ) :
                                        (
                                            <Typography align='center' variant='h4' style={{ width: '100%' }}>
                                                You&apos;ve completed the quiz!
                                            </Typography>
                                        )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Box>
        </>
    );
};

export default QuizPage;
