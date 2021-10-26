import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Paper,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';
import { isBrowser } from 'react-device-detect';

import bg from '../assets/images/bg.png';
import colours from '../utilities/colours';
import { QUIZTOWN_URL } from '../utilities/constants';


const useStyles = makeStyles(() => ({
    root: {
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
    },
    heroContainerTop: {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: isBrowser ? '0% 40%' : '0% 0%',
        marginTop: '8vh',
        height: '92vh',
        boxShadow: 'none',
    },
    heroContainerWhite: {
        backgroundColor: colours.WHITE,
        height: '100vh',
        boxShadow: 'none',
    },
    heroContainerBlue: {
        backgroundColor: colours.BLUE,
        height: '100vh',
        boxShadow: 'none',
    },
    box: {
        width: '80vw',
    },
    headbox: {
        width: '70vw',
    },
    titleLink: {
        textDecoration: 'none',
    },
    button: {
        height: isBrowser ? '8vh' : '6vh',
        width: isBrowser ? '240px' : '160px',
        borderRadius: 20,
        backgroundColor: colours.OFFBLACK,
        '&:hover': {
            backgroundColor: colours.DARKGREY,
        },
    },
}));

const TemplatePage: React.FC<{}> = () => {
    const classes = useStyles();
    const [scrollTop, setScrollTop] = React.useState(0);
    const [viewportHeights, setViewportHeights] = React.useState(0.0);

    React.useEffect(() => {
        const onScroll = (e: any) => {
            const currentY = e.target.documentElement.scrollTop;
            setScrollTop(currentY);
            setViewportHeights(currentY / window.innerHeight);
        };
        window.addEventListener('scroll', onScroll);
        console.log(viewportHeights);

        return () => window.removeEventListener('scroll', onScroll);
    }, [scrollTop]);

    const bodyHeaderFontSize = isBrowser ? '6vh' : '3vh';
    const bodyTextFontSize = isBrowser ? '3vh' : '2vh';

    return (
        <>
            <CssBaseline />
            <Box id='main' />
            <Paper className={classes.heroContainerTop}>
                <Box className={classes.root}>
                    <Box display='flex' height='92vh' flexDirection='column' alignItems='center'>
                        <Box className={classes.headbox}>
                            <Typography
                                align={isBrowser ? 'right' : 'left'}
                                style={{
                                    fontSize: isBrowser ? '8vh' : '4vh',
                                    marginTop: isBrowser ? '12vh' : '7vh',
                                    color: colours.WHITE,
                                }}>
                                Bring your flashcards to the next level.
                            </Typography>
                        </Box>
                        <Box className={classes.headbox}>
                            <Typography
                                align={isBrowser ? 'right' : 'left'}
                                style={{
                                    fontSize: isBrowser ? '3vh' : '2.5vh',
                                    marginTop: '7vh',
                                    color: colours.WHITE,
                                }}>
                                Tired of text-based flashcards?
                            </Typography>
                        </Box>
                        <Box className={classes.headbox}>
                            <Typography
                                align={isBrowser ? 'right' : 'left'}
                                style={{
                                    fontSize: isBrowser ? '3vh' : '2.5vh',
                                    marginTop: '0vh',
                                    color: colours.WHITE,
                                }}>
                                QuizTown spices up the game.
                            </Typography>
                        </Box>
                        <Box className={classes.headbox} style={{ marginTop: '7vh' }} justifyContent='right' alignItems='right'>
                            <Grid container justifyContent={isBrowser ? 'flex-end' : 'flex-start'}>
                                <Button className={classes.button} onClick={() => window.location.replace(QUIZTOWN_URL)}>
                                    <Typography align='right' style={{ fontSize: bodyTextFontSize, marginTop: '0vh', color: colours.WHITE }}>
                                        Try Out Now!
                                    </Typography>
                                </Button>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper className={classes.heroContainerWhite}>
                <Box id='about' />
                <Box className={classes.root}>
                    <Box display='flex' height='100vh' flexDirection='column' alignItems='center'>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '9vh', color: colours.BLUE }}>
                                Spaced Repetition
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.BLACK }}>
                                QuizTown helps you with spaced repetition to maximise your learning.<br />
                                We help you achieve more with less time.
                            </Typography>
                        </Box>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '10vh', color: colours.BLUE }}>
                                Image-Based Flashcards
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.BLACK }}>
                                QuizTown lets you create and use image-based flashcards.<br />
                                Perfect for preparing for those diagram questions!
                            </Typography>
                        </Box>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '10vh', color: colours.BLUE }}>
                                PDF Uploads
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.BLACK }}>
                                Simply upload your textbook or notes as a .pdf.<br />
                                QuizTown will automatically extract the images and generate questions!
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper className={classes.heroContainerBlue}>
                <Box id='faq' />
                <Box className={classes.root}>
                    <Box display='flex' height='100vh' flexDirection='column' alignItems='center'>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '9vh', color: colours.WHITE }}>
                                Can I use my senior&apos;s flashcards?
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.WHITE }}>
                                Yes you can! You can find other users&apos; collections<br />
                                and find other users&apos; shared collections and copy them into yours.
                            </Typography>
                        </Box>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '10vh', color: colours.WHITE }}>
                                How does QuizTown facilitate spaced repetition?
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.WHITE }}>
                                We&apos;ll take care of the math - you won&apos;t need that excel sheet anymore!<br />
                                Each day, QuizTown will prompt you to do cards that have reached the interval date.
                            </Typography>
                        </Box>
                        <Box className={classes.box}>
                            <Typography align='center' style={{ fontSize: bodyHeaderFontSize, marginTop: '10vh', color: colours.WHITE }}>
                                Can I adjust the intervals?
                            </Typography>
                            <Typography align='center' style={{ fontSize: bodyTextFontSize, marginTop: '2vh', color: colours.WHITE }}>
                                Of course! For each question, you will be given four options for the next interval.<br />
                                If none of them look good to you, you can also specify a custom interval!
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </>
    );
};

export default TemplatePage;
