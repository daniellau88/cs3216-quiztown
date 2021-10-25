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
import { CardEntity } from '../../../types/cards';
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
    card: CardEntity
    canvasRef: MutableRefObject<fabric.Canvas | undefined>
    saveEdits: (isAutosave: boolean) => void
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

    const canvasMaxWidth = imageMetadata.width;
    const canvasMaxHeight = imageMetadata.height;
    const imageXTranslation = Math.max(canvasMaxWidth - imageMetadata.width, 0) / 2;

    const initCanvasWithBg = () => {
        const canvas = new fabric.Canvas(CANVAS_ID, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            backgroundColor: 'transparent',
            selection: true,
        });
        return canvas;
    };

    const initEditingCanvas = () => {
        const canvas = initCanvasWithBg();
        initAnswerTextboxes(canvas, result, imageXTranslation);
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
            saveEdits(true);
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
        saveEdits(true);
    };

    const deleteAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(object => canvas.remove(object));
        canvas.discardActiveObject();
        stateManager?.saveState();
        saveEdits(true);
    };

    const mergeAnswerOption = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        mergeTextboxes(canvas, activeObjects);
        stateManager?.saveState();
        saveEdits(true);
    };

    return (
        <>
            <CssBaseline />
            <Grid container direction='column' className={classes.root}>
                <CollectionsImageCardEditControls
                    undo={() => stateManager?.undo()}
                    redo={() => stateManager?.redo()}
                    addOption={addAnswerOption}
                    deleteOption={deleteAnswerOption}
                    mergeOption={mergeAnswerOption}
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
        </>
    );
};

export default CardImageEdit;
