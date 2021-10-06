import {
    Box,
    CssBaseline,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React, { useEffect, useState } from 'react';

import { initAnswerBoxes, initAnswerOptions, validateAnswer } from '../utils';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    canvas: {
        border: '1px solid black',
    },
}));

interface ImageCardProps {
    isEditing?:boolean
}

const ImageCard: React.FC<ImageCardProps> = ({
    children,
    isEditing=false,
}) => {
    const classes = useStyles();
    const CANVAS_ID = 'quiztown-canvas';

    const initCanvas = () => {
        const canvas = new fabric.Canvas(CANVAS_ID,{
            hoverCursor: 'pointer',
            selection: false,
            targetFindTolerance: 2,
        });

        const optionsCoordsMap = initAnswerOptions(canvas, isEditing);
        initAnswerBoxes(canvas, isEditing);

        // canvas.setBackgroundImage('https://picsum.photos/200', canvas.renderAll.bind(canvas), {
        //     scaleX: 1,
        //     scaleY: 1,
        // });

        canvas.on('object:moving', (e) => {
            if (e.target) {
                e.target.opacity = 0.5;
            }
        });
        canvas.on('object:modified', (e) => {
            if (e.target?.type != 'text') {
                return;
            }

            if (e.target) {
                const text = e.target as fabric.Text;
                const isAnswerCorrect = validateAnswer(e.target);
                if (isAnswerCorrect) {
                    // Reveal the answer
                } else {
                    // Reset to original location
                    const textContent = text.get('text');
                    if (!textContent) return;

                    const originalCoord = optionsCoordsMap.get(textContent);
                    if (!originalCoord) return;

                    text.setPositionByOrigin(originalCoord, 'left', 'top');
                    text.setCoords();
                    e.target.opacity = 1;
                }
            }
        });
        return canvas;
    };

    useEffect(() => {
        initCanvas();
    }, []);


    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Box display="flex" justifyContent='center' width='100%'>
                    <canvas
                        id={CANVAS_ID}
                        // TODO: Make sizing dynamic
                        width={'500'}
                        height={'500'}
                        className={classes.canvas}
                    />
                </Box>
            </Box>
        </>
    );
};

export default ImageCard;
