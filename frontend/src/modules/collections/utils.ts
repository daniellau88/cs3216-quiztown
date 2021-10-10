import { fabric } from 'fabric';

import { AnswerData } from '../../types/collections';
import colours from '../../utilities/colours';

const TEXT_MARGIN = 40;
const TEXT_PADDING = 10;
const CANVAS_PADDING = 40;
const FONT_SIZE = 20;
const CORRECTNESS_MARGIN = 20;
const BORDER_RADIUS = 3;

// Image card generation utils

// TODO: Solve case where there are duplicate answer options
export const initAnswerOptions = (
    canvas: fabric.Canvas,
    data: Array<AnswerData>,
): Map<string, fabric.Point> => {
    const optionsCoordsMap = new Map();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const origin = new fabric.Point(CANVAS_PADDING, canvasHeight - CANVAS_PADDING);

    data.forEach(option => {
        const text = new fabric.Text(option.text, {
            fontSize: FONT_SIZE,
            perPixelTargetFind: true,
            hasControls: false,
            hasBorders: false,
            backgroundColor: colours.WHITE,
            padding: TEXT_PADDING,
        });
        text.setPositionByOrigin(origin, 'left', 'top');
        const textWidth = text.getBoundingRect().width;

        if (origin.x + textWidth > canvasWidth) {
            origin.setX(CANVAS_PADDING);
            origin.setY(origin.y - TEXT_MARGIN);

            optionsCoordsMap.set(option.text, new fabric.Point(origin.x, origin.y));
            text.setPositionByOrigin(origin, 'left', 'top');
            origin.setX(origin.x + textWidth + TEXT_MARGIN);

        } else {
            optionsCoordsMap.set(option.text, new fabric.Point(origin.x, origin.y));
            origin.setX(origin.x + textWidth + TEXT_MARGIN);
        }
        canvas.add(text);
    });
    return optionsCoordsMap;
};

const createAnswerTextBox = (box: AnswerData) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    return new fabric.Textbox(box.text, {
        top: top,
        left: left,
        width: box.bounding_box[1][0] - box.bounding_box[0][0],
        height: box.bounding_box[1][1] - box.bounding_box[0][1],
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        borderColor: colours.BLACK,
        backgroundColor: colours.WHITE,
        stroke: colours.BLACK,
        fontSize: FONT_SIZE,
    });
};

const createAnswerRectangle = (box: AnswerData) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    return new fabric.Rect({
        top: top,
        left: left,
        width: box.bounding_box[1][0] - box.bounding_box[0][0],
        height: box.bounding_box[1][1] - box.bounding_box[0][1],
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        rx: BORDER_RADIUS, 
        ry: BORDER_RADIUS,
        borderColor: colours.BLACK,
        backgroundColor: colours.WHITE,
        stroke: colours.BLACK,
    });
};

export const initAnswerBoxes = (
    canvas: fabric.Canvas,
    isEditing: boolean,
    data: Array<AnswerData>,
): Map<string, fabric.Rect> => {
    const answersCoordsMap = new Map();

    data.forEach(box => {
        const rect = createAnswerRectangle(box);
        const textbox = createAnswerTextBox(box);

        answersCoordsMap.set(box.text, rect);

        if (!isEditing) {
            canvas.add(rect);
        } else {
            canvas.add(textbox);
        }
    });
    return answersCoordsMap;
};

export const initCorrectAnswersIndicator = (
    canvas: fabric.Canvas,
    data: Array<AnswerData>,
): fabric.Text => {
    const correctAnswersIndicator = new fabric.Text(`0 / ${data.length.toString()}`, {
        top: CANVAS_PADDING,
        left: canvas.getWidth() - 2*CANVAS_PADDING,
        originX: 'left',
        originY: 'top',
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        backgroundColor: colours.WHITE,
        stroke: colours.GREEN,
        fontSize: FONT_SIZE,
    });
    canvas.add(correctAnswersIndicator);
    return correctAnswersIndicator;
};

// Image card functionality utils

export const validateAnswer = (
    answerOption: fabric.Text,
    answersCoordsMap: Map<string, fabric.Rect>,
): boolean => {
    const optionTop = answerOption.top;
    const optionLeft = answerOption.left;
    if (!optionTop || !optionLeft) return false;

    const textContent = answerOption.get('text');
    if (!textContent) return false;

    const answerData = answersCoordsMap.get(textContent);
    if (!answerData) return false;

    const answerTop = answerData.top;
    const answerLeft = answerData.left;
    if (!answerTop || !answerLeft) return false;

    return Math.abs(optionTop - answerTop) < CORRECTNESS_MARGIN
        && Math.abs(optionLeft - answerLeft) < CORRECTNESS_MARGIN;
};


export const revealAnswer = (
    answersCoordsMap: Map<string, fabric.Rect>,
    text: fabric.Text,
    canvas: fabric.Canvas,
): void => {
    const textContent = text.get('text');
    if (!textContent) return;

    const answerData = answersCoordsMap.get(textContent);
    if (!answerData) return;

    const answerTop = answerData.top;
    const answerLeft = answerData.left;
    if (!answerTop || !answerLeft) return;

    canvas.remove(answerData);

    const answerText = new fabric.Text(textContent, {
        top: answerTop,
        left: answerLeft,
        width: answerData.width,
        height: answerData.height,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        borderColor: colours.BLACK,
        backgroundColor: colours.WHITE,
        stroke: colours.GREEN,
        fontSize: FONT_SIZE,
    });
    canvas.add(answerText);
};

export const resetToOriginalPosition = (
    optionsCoordsMap: Map<string, fabric.Point>,
    text: fabric.Text,
): void => {
    const textContent = text.get('text');
    if (!textContent) return;

    const originalCoord = optionsCoordsMap.get(textContent);
    if (!originalCoord) return;

    text.setPositionByOrigin(originalCoord, 'left', 'top');
    text.setCoords();
};

export const updateCorrectAnswersIndicator = (correctAnswersIndicator:fabric.Text):boolean => {
    const textContent = correctAnswersIndicator.get('text');
    if (!textContent) return false;

    const answersData = textContent.split('/');
    const currCorrectAnswers = answersData[0];
    const maxCorrectAnswers = answersData[1];

    const updatedAnswerCount = parseInt(currCorrectAnswers) + 1;
    correctAnswersIndicator.set('text', `${updatedAnswerCount.toString()} /${maxCorrectAnswers}`);

    return updatedAnswerCount == parseInt(maxCorrectAnswers);
};
