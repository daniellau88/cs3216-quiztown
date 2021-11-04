import {
    Box,
    CssBaseline,
    Grid,
    makeStyles,
} from '@material-ui/core';
import { fabric } from 'fabric';
import React, { MutableRefObject, useEffect, useState } from 'react';

import StateManager from '../../../components/fabric/CanvasStateManager';
import QTTextbox from '../../../components/fabric/QTTextbox';
import { CardImageEntity } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { useWindowDimensions } from '../../../utilities/customHooks';
import {
    FONT_SIZE,
    initAnswerTextboxes,
    mergeTextboxes,
} from '../utils';

import CollectionsImageCardEditControls from './CollectionsImageCardEditControls';

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
    card: CardImageEntity
    canvasRef: MutableRefObject<fabric.Canvas | undefined>
    saveEdits: (imageXTranslation: number, imageScale: number) => void
}

type Props = OwnProps

const CardImageEdit: React.FC<Props> = ({
    card,
    canvasRef,
    saveEdits,
}) => {
    const classes = useStyles();

    const id = card.id;
    const imageUrl = card.image_link;
    const result = card.answer_details.results;
    const imageMetadata = card.image_metadata;
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [stateManager, setStateManager] = useState<StateManager>();

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = Math.floor(windowWidth * 0.9);
    const canvasMaxHeight = Math.floor(windowHeight * 0.8);
    const imageContainerWidth = canvasMaxWidth;
    const imageScaleX = imageContainerWidth / imageMetadata.width;
    const imageScaleY = canvasMaxHeight / imageMetadata.height;
    const imageScale = Math.min(imageScaleX, imageScaleY); // Maintains aspect ratio, object-fit == 'contain'
    const scaledImageWidth = Math.floor(imageMetadata.width * imageScale);
    const scaledImageHeight = Math.floor(imageMetadata.height * imageScale);
    const imageXTranslation = Math.floor(Math.max(canvasMaxWidth - scaledImageWidth, 0) / 2);

    const initEditingCanvas = () => {
        const canvas = new fabric.Canvas(CANVAS_ID, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            backgroundColor: 'transparent',
            selection: true,
        });
        initAnswerTextboxes(canvas, result, imageXTranslation, imageScale);
        return canvas;
    };

    useEffect(() => {
        const canvas = initEditingCanvas();
        if (canvasRef) {
            canvasRef.current = canvas;
        }
        const stateManager = new StateManager(canvas);
        canvas.on('object:modified', () => {
            stateManager.saveState();
            saveCanvasEdits();
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

    const saveCanvasEdits = () => {
        saveEdits(imageXTranslation, imageScale);
    };

    const addAnswerOption = () => {
        if (!canvas) return;
        const textbox = new QTTextbox('Answer Option', {
            hasBorders: false,
            borderColor: colours.BLACK,
            backgroundColor: colours.WHITE,
            stroke: colours.BLACK,
            fontSize: FONT_SIZE,
        });
        textbox.setControlsVisibility({ mtr: false });
        canvas.add(textbox);
        stateManager?.saveState();
        saveCanvasEdits();
    };

    const deleteAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(object => canvas.remove(object));
        canvas.discardActiveObject();
        stateManager?.saveState();
        saveCanvasEdits();
    };

    const mergeAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        mergeTextboxes(canvas, activeObjects);
        stateManager?.saveState();
        saveCanvasEdits();
    };

    return (
        <>
            <CssBaseline />
            <Grid container direction='column' className={classes.root}>
                <CollectionsImageCardEditControls
                    undo={() => {
                        stateManager?.undo();
                        saveCanvasEdits();
                    }}
                    redo={() => {
                        stateManager?.redo();
                        saveCanvasEdits();
                    }}
                    addOption={addAnswerOption}
                    deleteOption={deleteAnswerOption}
                    mergeOption={mergeAnswerOption}
                />
                <Box display="flex" justifyContent='center' width='100%'>
                    <img
                        src={imageUrl}
                        style={{
                            position: 'absolute',
                            width: scaledImageWidth,
                            height: scaledImageHeight,
                        }}
                    />
                    <canvas
                        id={CANVAS_ID}
                        width={canvasMaxWidth}
                        height={canvasMaxHeight}
                    />
                </Box>
            </Grid>
        </>
    );
};

export default CardImageEdit;
