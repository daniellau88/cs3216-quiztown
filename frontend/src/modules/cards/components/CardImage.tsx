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
import React, { useEffect, useState } from 'react';

import QTButton from '../../../components/QTButton';
import { AnswerData } from '../../../types/cards';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { getIntervals, getNextBoxNumber, getNextIntervalEndDate } from '../../../utilities/leitner';
import {
    initAnswerBoxes,
    initAnswerOptions,
    initCorrectAnswersIndicator,
    resetToOriginalPosition,
    revealAnswer,
    updateCorrectAnswersIndicator,
    validateAnswer,
} from '../utils';


const MAX_CANVAS_WIDTH = 1280;
const SCREEN_PADDING = 40;
const HEADER_HEIGHT = 80;

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    canvas: {
        border: '1px solid black',
        borderRadius: 10,
        boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
    },
}));

interface CardImageProps {
    isEditing?: boolean
    id: number,
    imageUrl: string,
    result: AnswerData[],
    imageMetadata: { width:number, height:number }
    onCardCompleted: (nextBoxNumber:number, nextDate:Date) => void
}

const CardImage: React.FC<CardImageProps> = ({
    isEditing = false,
    id,
    imageUrl,
    result,
    imageMetadata,
    onCardCompleted,
}) => {
    const classes = useStyles();
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [currentBox, setCurrentBox] = useState(0);

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = windowWidth - SCREEN_PADDING > MAX_CANVAS_WIDTH ? MAX_CANVAS_WIDTH : windowWidth;
    const canvasMaxHeight = windowHeight - HEADER_HEIGHT - SCREEN_PADDING;
    const imageXTranslation = Math.max(canvasMaxWidth - imageMetadata.width, 0) / 2;

    const initCanvasWithBg = () => {
        const canvas = new fabric.Canvas(CANVAS_ID, {
            hoverCursor: 'pointer',
            selection: false,
            targetFindTolerance: 2,
        });
        canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
            scaleX: 1,
            scaleY: 1,
            left: canvas.getCenter().left,
            originX: 'center',
        });
        return canvas;
    };

    const initEditingCanvas = () => {
        const canvas = initCanvasWithBg();
        initAnswerBoxes(canvas, isEditing, result, imageXTranslation);
        canvas.on('object:modified', (e) => {
            if (e.target?.type != 'textbox') {
                return;
            }
            if (e.target) {
                // TODO: Implement answer options edit
            }
        });
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
        setCanvas(canvas);
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
        const nextBoxNumber = getNextBoxNumber(currentBox, index + 1);
        const nextDate = getNextIntervalEndDate(nextBoxNumber);
        onCardCompleted(nextBoxNumber, nextDate);
    };

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Grid container>
                    <Box display="flex" justifyContent='center' width='100%'>
                        <canvas
                            id={CANVAS_ID}
                            width={canvasMaxWidth}
                            height={canvasMaxHeight}
                            className={classes.canvas}
                        />
                    </Box>

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
                            {getIntervals(currentBox).map((interval, index) => (
                                <QTButton
                                    key={index}
                                    onClick={() => selectConfidence(index)}
                                >
                                    Confidence: {index + 1}, Interval: {interval}
                                </QTButton>
                            ))}
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Box>
        </>
    );
};

export default CardImage;
