import {
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { fabric } from 'fabric';
import Moment from 'moment';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import StateManager from '../../../components/fabric/CanvasStateManager';
import QTTextbox from '../../../components/fabric/QTTextbox';
import QTButton from '../../../components/QTButton';
import { CardEntity, CardPostData } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { addDays, roundDownDay } from '../../../utilities/datetime';
import { Feedback, getFeedbackSet } from '../../../utilities/leitner';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';
import {
    FONT_SIZE,
    initAnswerBoxes,
    initAnswerOptions,
    initCorrectAnswersIndicator,
    mergeTextboxes,
    resetToOriginalPosition,
    revealAnswer,
    updateCorrectAnswersIndicator,
    validateAnswer,
} from '../utils';

import CollectionsImageCardEditControls from './CollectionsImageCardEditControls';

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
}));

interface CardImageProps {
    isEditing: boolean
    card: CardEntity
    canvasRef?: MutableRefObject<fabric.Canvas | undefined>
    saveEdits?: (isAutosave: boolean) => void
    onComplete?: () => void
}

const CardImage: React.FC<CardImageProps> = ({
    isEditing,
    card,
    canvasRef,
    saveEdits,
    onComplete = () => { return; },
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const id = card.id;
    const imageUrl = card.image_link;
    const result = card.answer_details.results;
    const imageMetadata = card.image_metadata;
    const boxNumber = card.box_number;
    const numOptions = result.length;
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [stateManager, setStateManager] = useState<StateManager>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [numGuesses, setNumGuesses] = useState(0); // TODO increment with user guess
    const [timeTaken, setTimeTaken] = useState<number>(0);

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = isEditing
        ? imageMetadata.width
        : windowWidth - SCREEN_PADDING > MAX_CANVAS_WIDTH
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
            selection: isEditing,
        });
        return canvas;
    };

    const initEditingCanvas = () => {
        const canvas = initCanvasWithBg();
        initAnswerBoxes(canvas, isEditing, result, imageXTranslation);
        return canvas;
    };

    const initQuizingCanvas = () => {
        const canvas = initCanvasWithBg();
        const answersCoordsMap = initAnswerBoxes(canvas, isEditing, result, imageXTranslation);
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
        const canvas = isEditing ? initEditingCanvas() : initQuizingCanvas();
        if (canvasRef) {
            canvasRef.current = canvas;
        }
        const stateManager = new StateManager(canvas);
        canvas.on('object:modified', () => {
            stateManager.saveState();
            saveEdits && saveEdits(true);
        });
        setCanvas(canvas);
        setStateManager(stateManager);
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

    const onClose = () => {
        console.log('Close dialog');
    };

    const addAnswerOption = () => {
        if (!canvas) return;
        canvas.add(new QTTextbox('Answer Option', {
            hasBorders: false,
            borderColor: colours.BLACK,
            backgroundColor: colours.WHITE,
            stroke: colours.BLACK,
            fontSize: FONT_SIZE,
        }));
        stateManager?.saveState();
        saveEdits && saveEdits(true);
    };

    const deleteAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(object => canvas.remove(object));
        canvas.discardActiveObject();
        stateManager?.saveState();
        saveEdits && saveEdits(true);
    };

    const mergeAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        mergeTextboxes(canvas, activeObjects);
        stateManager?.saveState();
        saveEdits && saveEdits(true);
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
                onComplete();
                return true;
            });
    };

    return (
        <>
            <CssBaseline />
            <Grid container direction='column' className={classes.root}>
                {isEditing &&
                    <CollectionsImageCardEditControls
                        undo={() => stateManager?.undo()}
                        redo={() => stateManager?.redo()}
                        addOption={addAnswerOption}
                        deleteOption={deleteAnswerOption}
                        mergeOption={mergeAnswerOption}
                    />
                }
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
                    {!isEditing &&
                        <QTButton outlined onClick={revealAllAnswers}>
                            Show answer
                        </QTButton>
                    }
                </Grid>

                <Dialog
                    open={hasAnsweredAll}
                    onClose={onClose}
                >
                    <DialogTitle>
                        Card completed!
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            You have answered all the questions in the cards, how confident did you feel?
                        </Typography>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        {getFeedbackSet(timeTaken, numOptions, numGuesses, boxNumber).map((feedback: Feedback, index: number) => {
                            return <Button key={index} onClick={() => sendUpdate(feedback)}>
                                <Grid container alignItems='center' justifyContent='center' direction='column'>
                                    {index == 0 ? <SentimentVeryDissatisfiedIcon /> : index == 1 ? <SentimentSatisfiedIcon /> : <SentimentVerySatisfiedIcon />}
                                    <Typography align='center'>
                                        Interval: {feedback.intervalLength}
                                    </Typography>
                                </Grid>
                            </Button>;
                        })}
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    );
};

export default CardImage;
