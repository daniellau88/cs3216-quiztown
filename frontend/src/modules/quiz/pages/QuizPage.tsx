import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import ConfettiExplosion from '@reonomy/react-confetti-explosion';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link, generatePath } from 'react-router-dom';

import Breadcrumbs from '../../../layouts/Breadcrumbs';
import colours from '../../../utilities/colours';
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
    link: {
        color: colours.BLACK,
        textDecoration: 'none',
        '&:hover': {
            color: colours.BLUE,
        },
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
                        <Box display='flex' height='100%' width='100%' flexDirection='row'>
                            {done ? (
                                <QuizCard cardId={cardIds[currentIndex]} onComplete={nextQuestion} />
                            ) :
                                (
                                    <Grid container justifyContent='center' alignItems='center' direction='column' style={{ width: '100%' }}>
                                        <ConfettiExplosion />
                                        <Typography align='center' variant='h5' style={{ width: '100%' }}>
                                            Well done, you&apos;ve completed your cards for today!
                                        </Typography>
                                        <Typography align='center' variant='h5' style={{ marginTop: '2vh', width: '100%' }}>
                                            Time to take that well deserved break!
                                        </Typography>
                                        <Grid container justifyContent='center' alignItems='center' style={{ marginTop: '2vh', width: '100%' }}>
                                            <Button>
                                                <Link to={generatePath(routes.ROOT)} className={classes.link}>
                                                    <Box display='flex' justifyContent='center' alignItems='center'>
                                                        <Typography>
                                                            Back Home
                                                        </Typography>
                                                    </Box>
                                                </Link>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </>
    );
};

export default QuizPage;
