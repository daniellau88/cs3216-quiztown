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
import colours from '../../../utilities/colours';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { addDays, roundDownDay } from '../../../utilities/datetime';
import { Feedback, getFeedbackSet } from '../../../utilities/leitner';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';
import {
    initAnswerOptions,
    initAnswerOptionsBoundingBox,
    initAnswerRectangles,
    initCorrectAnswersIndicator,
    initImageBoundingBox,
    resetToOriginalPosition,
    revealAnswer,
    shiftAnswerOptionsUp,
    updateCorrectAnswersIndicator,
    validateAnswer,
} from '../utils'; 

const useStyles = makeStyles(() => ({
    root: {
        paddingTop: '20px',
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
        alignSelf: 'center',
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

interface OwnProps {
    isOwner: boolean;
    card: CardEntity;
    onComplete?: () => void;
}

type Props = OwnProps

const CardImageQuiz: React.FC<Props> = ({
    isOwner,
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

    const canvasMaxWidth = windowWidth * 0.9;
    const canvasMaxHeight = windowHeight * 0.7;
    const answerOptionsContainerWidth = canvasMaxWidth * 0.3;
    const imageContainerWidth = canvasMaxWidth * 0.7;
    const imageScaleX = imageContainerWidth / imageMetadata.width;
    const imageScaleY = canvasMaxHeight / imageMetadata.height;
    const imageScale = Math.min(imageScaleX, imageScaleY); // Maintains aspect ratio, object-fit == 'contain'

    const startTime = Moment();

    const getCanvasTranslationToCenter = () => {
        const scaledImageWidth = imageMetadata.width * imageScale;
        const isImageSmallerThanContainerWidth = scaledImageWidth < imageContainerWidth;
        if (!isImageSmallerThanContainerWidth) return 0;

        const remainingWidth = imageContainerWidth - scaledImageWidth;
        return remainingWidth / 2;
    };

    const initQuizingCanvas = (canvasId: string) => {
        const canvas = new fabric.Canvas(canvasId, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            selection: false,
        });
        const canvasTranslationToCenter = getCanvasTranslationToCenter();
        const imageXTranslation = answerOptionsContainerWidth + canvasTranslationToCenter;

        const optionsCoordsMap = initAnswerOptions(canvas, result, canvasTranslationToCenter);
        initAnswerOptionsBoundingBox(canvas, answerOptionsContainerWidth, canvasTranslationToCenter);
        initImageBoundingBox(canvas, imageXTranslation, imageContainerWidth);
        fabric.Image.fromURL(imageUrl, function (img) {
            canvas.add(img);
            // We need this to have the answer options at a lower z-index, and the covering rectangles at a higher z-index
            // The +1 in `results.length + 1` is for the correctAnswersIndicator object
            for (let i = 0; i < result.length + 1; i++) {
                img.sendBackwards();
            }
        }, {
            scaleX: imageScale,
            scaleY: imageScale,
            left: imageXTranslation,
            selectable: false,
        });
        const answersCoordsMap = initAnswerRectangles(canvas, result, imageXTranslation, imageScale);
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
                shiftAnswerOptionsUp(canvas, optionsCoordsMap, text);
                stopTime().then(() => setHasAnsweredAll(updateCorrectAnswersIndicator(answersIndicator)));
            } else {
                e.target.opacity = 1;
                resetToOriginalPosition(optionsCoordsMap, text);
            }
        });
        return canvas;
    };

    useEffect(() => {
        const canvas = initQuizingCanvas(CANVAS_ID);
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
        canvas.getObjects().forEach(object => {
            const objectType = object.type;
            const shouldRemoveObject = objectType == 'QTText' || objectType == 'rect' || objectType == 'text';
            if (shouldRemoveObject) {
                canvas.remove(object);
            }
        });
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
                    <canvas
                        id={CANVAS_ID}
                        width={canvasMaxWidth}
                        height={canvasMaxHeight}
                    />
                </Box>
                <Grid container className={classes.showAnswerContainer}>
                    {!hasAnsweredAll && (
                        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                            <Button
                                className={classes.showAnswer}
                                onClick={revealAllAnswers}
                            >
                                Show Answer
                            </Button>
                        </Box>
                    )}
                    {hasAnsweredAll && (
                        isOwner ? (
                            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                                <Typography>
                                    How confident did you feel?
                                </Typography>
                                <Box display='flex' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                                    {getFeedbackSet(timeTaken, numOptions, numGuesses, numWrongGuesses, boxNumber).map((feedback: Feedback, index: number) => {
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
                            </Box>) :
                            <Typography>
                                Duplicate card to your collection now to start keeping track of your progress
                            </Typography>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default CardImageQuiz;
