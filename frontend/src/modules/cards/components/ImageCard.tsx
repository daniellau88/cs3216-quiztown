import {
    Box,
    CssBaseline,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React, { useEffect, useState } from 'react';

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

    const [canvas, setCanvas] = useState(new fabric.Canvas('dummy'));

    const initCanvas = () => {
        const canvas = new fabric.Canvas(CANVAS_ID,{
            hoverCursor: 'pointer',
            selection: false,
            targetFindTolerance: 2,
        });

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
            if (e.target) {
                e.target.opacity = 1;
            }
        });
        return canvas;
    };

    const initAnswerOptions = (canvas:fabric.Canvas) => {
        const MOCK_OPTIONS = ['Hypothalamus', 'Kangaroo', 'LongNameMedicalPartOfBodyBones', 'Short', 'SomeBones', 'OtherBones'];
        if (isEditing) {
            MOCK_OPTIONS.forEach(option => {
                // Use textbox to allow edit
                const textbox = new fabric.Textbox(option);

                textbox.perPixelTargetFind = true;
                canvas.add(textbox);
            });
            return;
        }

        MOCK_OPTIONS.forEach(option => {
            const text = new fabric.Text(option);

            text.perPixelTargetFind = true;
            text.hasControls = text.hasBorders = false;
            canvas.add(text);
        });
    };

    useEffect(() => {
        const canvas = initCanvas();
        setCanvas(canvas);
        initAnswerOptions(canvas);
    }, []);


    return (
        <>
            <CssBaseline />
            <Box className={classes.root}>
                <Box display="flex" justifyContent='center' width='100%'>
                    <canvas
                        id={CANVAS_ID}
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
