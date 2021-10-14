import {
    Box,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React, { MutableRefObject, useEffect, useState } from 'react';

import StateManager from '../../../components/fabric/CanvasStateManager';
import QTTextbox from '../../../components/fabric/QTTextbox';
import QTButton from '../../../components/QTButton';
import { AnswerData } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { useWindowDimensions } from '../../../utilities/customHooks';
import {
    FONT_SIZE,
    initAnswerBoxes,
    initAnswerOptions,
    initCorrectAnswersIndicator,
    resetToOriginalPosition,
    revealAnswer,
    updateCorrectAnswersIndicator,
    validateAnswer,
} from '../utils';

import CollectionsImageCardEditControls from './CollectionsImageCardEditControls';

const MAX_CANVAS_WIDTH = 1280;
const SCREEN_PADDING = 40;
const HEADER_HEIGHT = 80;

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    imageContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

interface CardImageProps {
    isEditing: boolean
    id: number,
    imageUrl: string,
    result: AnswerData[],
    imageMetadata: { width:number, height:number }
    onCardCompleted?: (nextBoxNumber:number, nextDate:Date) => void
    saveAnswerData?: (canvas:fabric.Canvas) => void
    canvasRef?: MutableRefObject<fabric.Canvas | undefined>
}

const CardImage: React.FC<CardImageProps> = ({
    isEditing,
    id,
    imageUrl,
    result,
    imageMetadata,
    onCardCompleted,
    saveAnswerData,
    canvasRef,
}) => {
    const classes = useStyles();
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [stateManager, setStateManager] = useState<StateManager>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [currentBox, setCurrentBox] = useState(0);

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = windowWidth - SCREEN_PADDING > MAX_CANVAS_WIDTH ? MAX_CANVAS_WIDTH : windowWidth;
    const canvasMaxHeight = windowHeight - HEADER_HEIGHT - SCREEN_PADDING;
    const imageXTranslation = Math.max(canvasMaxWidth - imageMetadata.width, 0) / 2;

    const initCanvasWithBg = () => {
        const canvas = new fabric.Canvas(CANVAS_ID, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            backgroundColor: 'transparent',
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
            const isAnswerCorrect = validateAnswer(text, answersCoordsMap);
            if (isAnswerCorrect) {
                canvas.remove(e.target);
                revealAnswer(answersCoordsMap, text, canvas);
                setHasAnsweredAll(updateCorrectAnswersIndicator(answersIndicator));
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

    const onClose = () => {
        console.log('Close dialog');
    };

    const selectConfidence = (index: number) => {
        // const nextBoxNumber = getNextBoxNumber(currentBox, index + 1);
        // const nextDate = getNextIntervalEndDate(nextBoxNumber);
        // onCardCompleted(nextBoxNumber, nextDate);
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
    };

    const deleteAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(object => canvas.remove(object));
        canvas.discardActiveObject();
        stateManager?.saveState();
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container direction='column'>
                    <CollectionsImageCardEditControls
                        undo={() => stateManager?.undo()}
                        redo={() => stateManager?.redo()}
                        addOption={addAnswerOption}
                        deleteOption={deleteAnswerOption}
                    />
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
                    <DialogActions>
                        {/* {getIntervals(currentBox).map((interval, index) => (
                                <QTButton
                                    key={index}
                                    onClick={() => selectConfidence(index)}
                                >
                                    Confidence: {index + 1}, Interval: {interval}
                                </QTButton>
                            ))} */}
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default CardImage;
