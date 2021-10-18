import { fabric } from 'fabric';

import QTText from '../../components/fabric/QTText';
import QTTextbox from '../../components/fabric/QTTextbox';
import { AnswerData } from '../../types/cards';
import colours from '../../utilities/colours';

export const FONT_SIZE = 20;
const TEXT_MARGIN = 40;
const TEXT_PADDING = 10;
const CANVAS_PADDING = 40;
const BORDER_RADIUS = 5;
// Textbox uses default height and scaleY, so even height of 500 will display as 24. We need to use scaleY to update the rendered height.
const DEFAULT_TEXTBOX_HEIGHT = 24;

// Image card generation utils

// TODO: Solve case where there are duplicate answer options
export const initAnswerOptions = (
    canvas: fabric.Canvas,
    data: Array<AnswerData>,
): Map<string, fabric.Point> => {
    const optionsCoordsMap = new Map();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const origin = new fabric.Point(CANVAS_PADDING, canvasHeight + CANVAS_PADDING);
    canvas.setHeight(canvasHeight + 2*CANVAS_PADDING);

    data.forEach(option => {
        const text = new QTText(option.text, {
            perPixelTargetFind: true,
            fontSize: FONT_SIZE,
            rx: BORDER_RADIUS,
            ry: BORDER_RADIUS,
            hasControls: false,
            hasBorders: false,
            padding: TEXT_PADDING,
        });
        text.setPositionByOrigin(origin, 'left', 'top');
        const textWidth = text.getBoundingRect().width;
        const textHeight = text.getBoundingRect().height;

        if (origin.x + textWidth > canvasWidth) {
            origin.setX(CANVAS_PADDING);
            origin.setY(origin.y + TEXT_MARGIN);

            optionsCoordsMap.set(option.text, new fabric.Point(origin.x, origin.y));
            text.setPositionByOrigin(origin, 'left', 'top');
            origin.setX(origin.x + textWidth + TEXT_MARGIN);
            // Dynamically resize canvas as more answer options are added
            canvas.setHeight(canvas.getHeight() + TEXT_MARGIN + textHeight);

        } else {
            optionsCoordsMap.set(option.text, new fabric.Point(origin.x, origin.y));
            origin.setX(origin.x + textWidth + TEXT_MARGIN);
        }
        canvas.add(text);
    });
    return optionsCoordsMap;
};

const createAnswerTextBox = (box: AnswerData, xTranslation:number) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    const width = box.bounding_box[1][0] - box.bounding_box[0][0];
    const height = box.bounding_box[1][1] - box.bounding_box[0][1];
    const scaleY = height / DEFAULT_TEXTBOX_HEIGHT;

    return new QTTextbox(box.text, {
        top: top,
        left: left + xTranslation,
        width: width,
        height: height,
        hasBorders: false,
        borderColor: colours.BLACK,
        backgroundColor: colours.WHITE,
        stroke: colours.BLACK,
        fontSize: FONT_SIZE,
        scaleY: scaleY,
    });
};

const createAnswerRectangle = (box: AnswerData, xTranslation:number) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    return new fabric.Rect({
        top: top,
        left: left + xTranslation,
        width: box.bounding_box[1][0] - box.bounding_box[0][0],
        height: box.bounding_box[1][1] - box.bounding_box[0][1],
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        rx: BORDER_RADIUS,
        ry: BORDER_RADIUS,
        borderColor: colours.BLACK,
        fill: colours.WHITE,
        stroke: colours.BLACK,
    });
};

export const initAnswerBoxes = (
    canvas: fabric.Canvas,
    isEditing: boolean,
    data: Array<AnswerData>,
    xTranslation: number,
): Map<string, fabric.Rect> => {
    const answersCoordsMap = new Map();

    data.forEach(box => {
        const rect = createAnswerRectangle(box, xTranslation);
        const textbox = createAnswerTextBox(box, xTranslation);

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
        left: canvas.getWidth() - 2 * CANVAS_PADDING,
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
    mouseCoordinate: { x: number, y: number },
): boolean => {
    if (!mouseCoordinate) return false;

    const textContent = answerOption.get('text');
    if (!textContent) return false;

    const answerData = answersCoordsMap.get(textContent);
    if (!answerData) return false;

    const answerTop = answerData.top;
    const answerLeft = answerData.left;
    const answerHeight = answerData.height;
    const answerWidth = answerData.width;
    if (!answerTop || !answerLeft || !answerHeight || !answerWidth) return false;

    return (mouseCoordinate.y >= answerTop && mouseCoordinate.y <= answerTop + answerHeight)
         && (mouseCoordinate.x >= answerLeft && mouseCoordinate.x <= answerLeft + answerWidth);
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

    canvas.remove(answerData);
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

export const updateCorrectAnswersIndicator = (correctAnswersIndicator: fabric.Text): boolean => {
    const textContent = correctAnswersIndicator.get('text');
    if (!textContent) return false;

    const answersData = textContent.split('/');
    const currCorrectAnswers = answersData[0];
    const maxCorrectAnswers = answersData[1];

    const updatedAnswerCount = parseInt(currCorrectAnswers) + 1;
    correctAnswersIndicator.set('text', `${updatedAnswerCount.toString()} /${maxCorrectAnswers}`);

    return updatedAnswerCount == parseInt(maxCorrectAnswers);
};
