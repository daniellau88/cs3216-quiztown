import {
    Box,
    Button,
    Chip,
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
import { isBrowser } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { CardImageEntity, CardPostData } from '../../../types/cards';
import colours from '../../../utilities/colours';
import { useWindowDimensions } from '../../../utilities/customHooks';
import { addDays, roundDownDay } from '../../../utilities/datetime';
import { Feedback, getFeedbackSet } from '../../../utilities/leitner';
import { handleApiRequest } from '../../../utilities/ui';
import { updateCard } from '../operations';
import {
    initAnswerRectangles,
    initCorrectAnswersIndicator,
    initImageBoundingBox,
    revealAnswerExternal,
    showWrongAnswerIndicator,
    updateCorrectAnswersIndicator,
    validateAnswerExternal,
} from '../utils';

const tagKey = 'tagAnswerId';

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
    answersGrid: {
        outline: '1px solid black',
        width: '25vw',
        height: '60vh',
        margin: '10px',
        padding: '10px',
        overflowY: 'scroll',
        borderRadius: '10px',
    },
    answerOptions: {
        cursor: 'pointer',
        padding: '20px',
        margin: '10px',
        fontSize: 'large',
    },
}));

interface OwnProps {
    isOwner: boolean;
    card: CardImageEntity;
    onComplete?: () => void;
}

interface Option {
    text: string;
    hidden: boolean;
}

interface AdditionalCanvasInfo {
    isDragging: boolean;
    lastPosX: number;
    lastPosY: number;
}

type NumWrongGuesses = number;
type NumGuesses = number;
type QuizGuessCount = [NumGuesses, NumWrongGuesses];

type Props = OwnProps

const CardImageQuiz: React.FC<Props> = ({
    isOwner,
    card,
    onComplete,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const id = card.id;
    const imageUrl = card.image_link;
    const result = card.answer_details.results;
    const sortedResult = [...result];
    sortedResult.sort((x, y) => x.text.localeCompare(y.text));
    const imageMetadata = card.image_metadata;
    const boxNumber = card.box_number;
    const numOptions = result.length;
    const CANVAS_ID = 'quiztown-canvas-' + id;

    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [hasAnsweredAll, setHasAnsweredAll] = useState(false);
    const [timeTaken, setTimeTaken] = useState<number>(0);
    const [textOptions, setTextOptions] = useState<Option[]>(sortedResult.map(res => { return { text: res.text, hidden: false }; }));

    const { windowHeight, windowWidth } = useWindowDimensions();

    const canvasMaxWidth = windowWidth * (isBrowser ? 0.7 : 1);
    const canvasMaxHeight = windowHeight * 0.65;
    const imageScaleX = canvasMaxWidth / imageMetadata.width;
    const imageScaleY = canvasMaxHeight / imageMetadata.height;
    const imageScale = Math.min(imageScaleX, imageScaleY); // Maintains aspect ratio, object-fit == 'contain'
    const actualCanvasWidth = imageScale * imageMetadata.width;
    const actualCanvasHeight = imageScale * imageMetadata.height;

    // Using this instead of React state as Fabric handlers don't update React state
    const guessCounter: QuizGuessCount = [0, 0];
    const startTime = Moment();

    const initQuizingCanvas = (canvasId: string) => {
        const canvas = new fabric.Canvas(canvasId, {
            hoverCursor: 'pointer',
            targetFindTolerance: 2,
            selection: false,
            fireMiddleClick: true,
        });
        canvas.setDimensions({ width: actualCanvasWidth, height: actualCanvasHeight });
        const imageXTranslation = 0;

        initImageBoundingBox(canvas, imageXTranslation, actualCanvasWidth);
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

        canvas.on('drop', (e) => {
            const currPointer = canvas.getPointer(e.e);
            const event = (e.e as unknown) as React.DragEvent;
            const id = parseInt(event.dataTransfer.getData(tagKey));
            const text = sortedResult[id].text;

            const correctAnswerRect = validateAnswerExternal(text, answersCoordsMap, currPointer);

            guessCounter[0] = guessCounter[0] + 1;
            if (correctAnswerRect) {
                revealAnswerExternal(canvas, correctAnswerRect);
                textOptions[id].hidden = true;
                setTextOptions([...textOptions]);
                stopTime().then(() => setHasAnsweredAll(updateCorrectAnswersIndicator(answersIndicator)));
            } else {
                guessCounter[1] = guessCounter[1] + 1;
                showWrongAnswerIndicator(canvas, currPointer);
            }
        });

        // Manage zoom
        canvas.on('mouse:wheel', function (opt) {
            const delta = opt.e.deltaY;
            let zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
            const vpt = canvas.viewportTransform!;
            if (zoom < 1) {
                // Center image if zooming out
                vpt[4] = actualCanvasWidth / 2 - actualCanvasWidth * zoom / 2;
                vpt[5] = actualCanvasHeight / 2 - actualCanvasHeight * zoom / 2;
            } else {
                if (vpt[4] >= 0) {
                    vpt[4] = 0;
                } else if (vpt[4] < canvas.getWidth() - actualCanvasWidth * zoom) {
                    vpt[4] = canvas.getWidth() - actualCanvasWidth * zoom;
                }
                if (vpt[5] >= 0) {
                    vpt[5] = 0;
                } else if (vpt[5] < canvas.getHeight() - actualCanvasHeight * zoom) {
                    vpt[5] = canvas.getHeight() - actualCanvasHeight * zoom;
                }
            }
        });

        // Manage panning (store pan details on canvas)
        (canvas as any).additionalInfo = {
            isDragging: false,
            lastPosX: 0,
            lastPosY: 0,
        } as AdditionalCanvasInfo;
        const getAdditionalCanvasInfo = (canvas: fabric.Canvas): AdditionalCanvasInfo => {
            return (canvas as any).additionalInfo;
        };

        const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent => {
            return (e as TouchEvent).targetTouches !== undefined;
        };

        interface Coordinate {
            x: number;
            y: number;
        }

        const getClientCoordinatesFromEvent = (e: MouseEvent | TouchEvent): Coordinate => {
            if (isTouchEvent(e)) {
                return {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY,
                };
            } else {
                return {
                    x: e.clientX,
                    y: e.clientY,
                };
            }
        };

        canvas.on('mouse:down', function (opt) {
            const evt = opt.e;
            const additionalInfo = getAdditionalCanvasInfo(canvas);
            additionalInfo.isDragging = true;
            const coordinate = getClientCoordinatesFromEvent(evt);
            additionalInfo.lastPosX = coordinate.x;
            additionalInfo.lastPosY = coordinate.y;
        });

        canvas.on('mouse:move', function (opt) {
            const additionalInfo = getAdditionalCanvasInfo(canvas);
            if (additionalInfo.isDragging) {
                const e = opt.e;
                const zoom = canvas.getZoom();
                const vpt = canvas.viewportTransform!;
                const coordinate = getClientCoordinatesFromEvent(e);
                if (zoom < 1) {
                    // Center image if zooming out
                    vpt[4] = actualCanvasWidth / 2 - actualCanvasWidth * zoom / 2;
                    vpt[5] = actualCanvasHeight / 2 - actualCanvasHeight * zoom / 2;
                } else {
                    vpt[4] += coordinate.x - additionalInfo.lastPosX;
                    vpt[5] += coordinate.y - additionalInfo.lastPosY;
                    if (vpt[4] >= 0) {
                        vpt[4] = 0;
                    } else if (vpt[4] < canvas.getWidth() - actualCanvasWidth * zoom) {
                        vpt[4] = canvas.getWidth() - actualCanvasWidth * zoom;
                    }
                    if (vpt[5] >= 0) {
                        vpt[5] = 0;
                    } else if (vpt[5] < canvas.getHeight() - actualCanvasHeight * zoom) {
                        vpt[5] = canvas.getHeight() - actualCanvasHeight * zoom;
                    }
                }
                canvas.requestRenderAll();
                additionalInfo.lastPosX = coordinate.x;
                additionalInfo.lastPosY = coordinate.y;
            }
        });

        canvas.on('mouse:up', function (opt) {
            const additionalInfo = getAdditionalCanvasInfo(canvas);
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            canvas.setViewportTransform(canvas.viewportTransform!);
            additionalInfo.isDragging = false;
        });

        return canvas;
    };

    useEffect(() => {
        const canvas = initQuizingCanvas(CANVAS_ID);
        setCanvas(canvas);
    }, []);

    useEffect(() => {
        // TODO: A bit buggy, but for now it works for resizing
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

    const handleTagDrag = (e: React.DragEvent<HTMLElement>) => {
        const target: any = e.target;
        const id = target.id ? target.id : '';
        e.dataTransfer.setData(tagKey, id);
    };

    return (
        <>
            <CssBaseline />
            <Grid container direction='column' className={classes.root}>
                <Grid item container direction="row" justifyContent="center">
                    {isBrowser && (
                        <div className={classes.answersGrid}>
                            {textOptions.map((text, id) =>
                                <div key={id}>
                                    {!text.hidden && <Chip size="medium" draggable id={`${id}`} className={classes.answerOptions} onDragStart={handleTagDrag} label={text.text}></Chip>}
                                </div>,
                            )}
                        </div>)}
                    <canvas
                        id={CANVAS_ID}
                        width={actualCanvasWidth}
                        height={actualCanvasHeight}
                    />
                </Grid>
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
                        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                            {isOwner ? (
                                <>
                                    <Typography>
                                        How confident did you feel?
                                    </Typography>
                                    <Box display='flex' alignItems='center' justifyContent='center' style={{ width: '95%' }}>
                                        {getFeedbackSet(timeTaken, numOptions, guessCounter[0], guessCounter[1], boxNumber).map((feedback: Feedback, index: number) => {
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
                                </>
                            ) : (
                                <Typography>
                                    Duplicate card to your collection now to start keeping track of your progress
                                </Typography>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default CardImageQuiz;
