import {
    Box,
    Button,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { fabric } from 'fabric';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { CardEntity, CardPostData } from '../../../types/cards';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { addDays, roundDownDay } from '../../../utilities/datetime';
import { Feedback, getFeedbackSet } from '../../../utilities/leitner';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';
import {
    initAnswerOptions,
    initAnswerRectangles,
    initCorrectAnswersIndicator,
    resetToOriginalPosition,
    revealAnswer,
    updateCorrectAnswersIndicator,
    validateAnswer,
} from '../utils';

const MAX_CANVAS_WIDTH = 1280;
const SCREEN_PADDING = 40;

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
}));

interface OwnProps {
    card: CardEntity
    onComplete?: () => void
}

type Props = OwnProps

const CardImageQuiz: React.FC<Props> = ({
    card,
    onComplete = () => { return; },
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const id = card.id;
    const imageUrl = card.image_link;
    const result = card.answer_details.results;
    const imageMetadata = card.image_metadata;
    const boxNumber = card.box_number;
    const numOptions = result.length;
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [numGuesses, setNumGuesses] = useState(0); // TODO increment with user guess (both correct + wrong)
    const [numWrongGuesses, setNumWrongGuesses] = useState(0); // TODO increment with user guess (only wrong)
    const [timeTaken, setTimeTaken] = useState<number>(0);

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = windowWidth - SCREEN_PADDING > MAX_CANVAS_WIDTH
        ? MAX_CANVAS_WIDTH
        : windowWidth;
    const canvasMaxHeight = imageMetadata.height;
    const imageXTranslation = Math.max(canvasMaxWidth - imageMetadata.width, 0) / 2;

    const startTime = Moment();

    const initCanvasWithBg = () => {
        const canvas = new fabric.Canvas(CANVAS_ID, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            backgroundColor: 'transparent',
            selection: false,
        });
        return canvas;
    };

    const initQuizingCanvas = () => {
        const canvas = initCanvasWithBg();
        const answersCoordsMap = initAnswerRectangles(canvas, result, imageXTranslation);
        const optionsCoordsMap = initAnswerOptions(canvas, result);
        const answersIndicator = initCorrectAnswersIndicator(canvas, result);
        canvas.on('object:moving', (e) => {
            if (e.target) {
                e.target.opacity = 0.5;
            }
        });
        canvas.on('object:modified', (e) => {
            if (e.target?.type != 'QTText') {
                return;
            }

            const text = e.target as fabric.Text;
            const isAnswerCorrect = validateAnswer(text, answersCoordsMap, canvas.getPointer(e.e));
            if (isAnswerCorrect) {
                canvas.remove(e.target);
                revealAnswer(answersCoordsMap, text, canvas);
                stopTime().then(() => setHasAnsweredAll(updateCorrectAnswersIndicator(answersIndicator)));
            } else {
                e.target.opacity = 1;
                resetToOriginalPosition(optionsCoordsMap, text);
            }
        });
        return canvas;
    };

    useEffect(() => {
        const canvas = initQuizingCanvas();
        setCanvas(canvas);
    }, []);

    useEffect(() => {
        if (canvas) {
            const scale = canvasMaxWidth / canvas.getWidth();
            canvas.setDimensions({ width: canvasMaxWidth, height: canvasMaxHeight });
            canvas.setViewportTransform([canvas.getZoom() * scale, 0, 0, canvas.getZoom() * scale, 0, 0]);
        }
    }, [windowHeight, windowWidth]);

    const stopTime = async () => {
        const endTime = Moment();
        setTimeTaken(Moment.duration(endTime.diff(startTime)).seconds());
    };

    const revealAllAnswers = () => {
        if (!canvas) return;
        canvas.getObjects().forEach(object => canvas.remove(object));
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
                <Box display="flex" justifyContent='center' width='100%'>
                    <Box
                        className={classes.imageContainer}
                        style={{ height: canvasMaxHeight, width: canvasMaxWidth }}
                    >
                        <img
                            src={imageUrl}
                            style={{ position: 'absolute', left: (canvasMaxWidth - imageMetadata.width) / 2 }}
                        />
                    </Box>
                    <canvas
                        id={CANVAS_ID}
                        width={canvasMaxWidth}
                        height={canvasMaxHeight}
                    />
                </Box>
                <Grid item className={classes.showAnswerContainer}>
                    {!hasAnsweredAll && (
                        <Button
                            className={classes.showAnswer}
                            onClick={revealAllAnswers}
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
                                {getFeedbackSet(timeTaken, numOptions, numGuesses, numWrongGuesses, boxNumber).map((feedback: Feedback, index: number) => {
                                    return <Button key={index} onClick={() => sendUpdate(feedback)}>
                                        <Grid container alignItems='center' justifyContent='center' direction='column'>
                                            {index == 0 ? <SentimentVeryDissatisfiedIcon /> : index == 1 ? <SentimentSatisfiedIcon /> : <SentimentVerySatisfiedIcon />}
                                            <Typography align='center'>
                                                Interval: {feedback.intervalLength}
                                            </Typography>
                                        </Grid>
                                    </Button>;
                                })}
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default CardImageQuiz;
