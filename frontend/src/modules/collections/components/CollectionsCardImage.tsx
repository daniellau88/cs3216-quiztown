import {
    Box,
    CssBaseline,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React, { useEffect, useState } from 'react';

import { AnswerData } from '../../../types/collections';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { initAnswerBoxes, initAnswerOptions, initCorrectAnswersIndicator, resetToOriginalPosition, revealAnswer, updateCorrectAnswersIndicator, validateAnswer } from '../utils';

const MAX_CANVAS_WIDTH = 1440;
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

interface CollectionsCardImageProps {
    isEditing?: boolean
    id: number,
    imageUrl: string,
    result: AnswerData[],
}

const CollectionsCardImage: React.FC<CollectionsCardImageProps> = ({
    isEditing = false,
    id,
    imageUrl,
    result,
}) => {
    const classes = useStyles();
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = windowWidth > MAX_CANVAS_WIDTH ? MAX_CANVAS_WIDTH : windowWidth;
    const canvasMaxHeight = windowHeight - HEADER_HEIGHT;

    const initCanvasWithBg = () => {
        const canvas = new fabric.Canvas(CANVAS_ID,{
            hoverCursor: 'pointer',
            selection: false,
            targetFindTolerance: 2,
        });
        canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
            scaleX: 1,
            scaleY: 1,
            // TODO: Center at middle once can get image width, so that can translate answer boxes too
            // left: canvas.getCenter().left,
            // originX: 'center',
        });
        return canvas;
    };

    const initEditingCanvas = () => {
        const canvas = initCanvasWithBg();
        initAnswerBoxes(canvas, isEditing, result);
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
        const answersCoordsMap = initAnswerBoxes(canvas, isEditing, result);
        const optionsCoordsMap = initAnswerOptions(canvas, result);
        const answersIndicator = initCorrectAnswersIndicator(canvas, result);
        canvas.on('object:moving', (e) => {
            if (e.target) {
                e.target.opacity = 0.5;
            }
        });
        canvas.on('object:modified', (e) => {
            if (e.target?.type != 'text') {
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

    if (hasAnsweredAll) {
        return (
            <Grid>
                <Typography variant='h2'>
                    You correctly filled in all the blanks!
                </Typography>
                <Typography variant='h2'>
                    How confident are you?
                </Typography>
            </Grid>
        );
    }

    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Box display="flex" justifyContent='center' width='100%'>
                    <canvas
                        id={CANVAS_ID}
                        width={canvasMaxWidth}
                        height={canvasMaxHeight}
                        className={classes.canvas}
                    />
                </Box>
            </Box>
        </>
    );
};

export default CollectionsCardImage;
