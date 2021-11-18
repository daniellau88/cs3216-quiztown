import { fabric } from 'fabric';

import QTCross from '../../components/fabric/QTCross';
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
    xTranslation: number,
): Map<string, fabric.Point> => {
    const optionsCoordsMap = new Map();
    const origin = new fabric.Point(CANVAS_PADDING + xTranslation, CANVAS_PADDING);
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
        const textHeight = text.getBoundingRect().height;

        optionsCoordsMap.set(option.text, new fabric.Point(origin.x, origin.y));
        origin.setY(origin.y + textHeight + TEXT_MARGIN);
        canvas.add(text);
    });
    return optionsCoordsMap;
};

export const initAnswerOptionsBoundingBox = (
    canvas: fabric.Canvas,
    containerWidth: number,
    xTranslation: number,
): void => {
    const boundingBox = new fabric.Rect({
        top: 0,
        left: xTranslation,
        width: containerWidth - CANVAS_PADDING,
        height: canvas.getHeight() - CANVAS_PADDING,
        rx: BORDER_RADIUS,
        ry: BORDER_RADIUS,
        selectable: false,
        borderColor: colours.BLACK,
        fill: 'transparent',
        stroke: colours.BLACK,
    });
    const whitePadding = new fabric.Rect({
        top: canvas.getHeight() - CANVAS_PADDING + 5,
        left: xTranslation,
        width: containerWidth - CANVAS_PADDING,
        height: CANVAS_PADDING,
        selectable: false,
        fill: colours.WHITE,
    });
    canvas.add(boundingBox, whitePadding);
    boundingBox.sendToBack();
};

export const initImageBoundingBox = (
    canvas: fabric.Canvas,
    left: number,
    containerWidth: number,
): void => {
    const boundingBox = new fabric.Rect({
        top: 0,
        left: left - CANVAS_PADDING,
        width: containerWidth + CANVAS_PADDING,
        height: canvas.getHeight(),
        selectable: false,
        fill: colours.WHITE,
    });
    canvas.add(boundingBox);
};


const createAnswerTextBox = (
    box: AnswerData,
    xTranslation: number,
    scale: number,
) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    const width = box.bounding_box[1][0] - box.bounding_box[0][0];
    const height = box.bounding_box[1][1] - box.bounding_box[0][1];

    return new QTTextbox(box.text, {
        top: (top * scale),
        left: (left * scale) + xTranslation,
        width: width * scale,
        height: height * scale,
        hasBorders: false,
        borderColor: colours.BLACK,
        backgroundColor: colours.WHITE,
        stroke: colours.BLACK,
        fontSize: FONT_SIZE,
    });
};

const createAnswerRectangle = (
    box: AnswerData,
    xTranslation: number,
    scale: number,
) => {
    const top = box.bounding_box[0][1];
    const left = box.bounding_box[0][0];
    return new fabric.Rect({
        top: (top * scale),
        left: (left * scale) + xTranslation,
        width: box.bounding_box[1][0] - box.bounding_box[0][0],
        height: box.bounding_box[1][1] - box.bounding_box[0][1],
        selectable: false,
        rx: BORDER_RADIUS,
        ry: BORDER_RADIUS,
        borderColor: colours.BLACK,
        fill: colours.WHITE,
        stroke: colours.BLACK,
        scaleX: scale,
        scaleY: scale,
    });
};

// Used in CardImageQuiz
export const initAnswerRectangles = (
    canvas: fabric.Canvas,
    data: Array<AnswerData>,
    xTranslation: number,
    scale: number,
): Map<string, fabric.Rect[]> => {
    const answersCoordsMap = new Map<string, fabric.Rect[]>();

    data.forEach(box => {
        const rect = createAnswerRectangle(box, xTranslation, scale);
        if (!answersCoordsMap.has(box.text)) {
            answersCoordsMap.set(box.text, []);
        }
        answersCoordsMap.get(box.text)!.push(rect);
        canvas.add(rect);
        rect.bringToFront();
    });
    return answersCoordsMap;
};

// Used in CardImageEdit
export const initAnswerTextboxes = (
    canvas: fabric.Canvas,
    data: Array<AnswerData>,
    xTranslation: number,
    scale: number,
): void => {
    data.forEach(box => {
        const textbox = createAnswerTextBox(box, xTranslation, scale);
        textbox.setControlsVisibility({ mtr: false });
        canvas.add(textbox);
    });
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
    correctAnswersIndicator.bringToFront();
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

export const validateAnswerExternal = (
    text: string,
    answersCoordsMap: Map<string, fabric.Rect[]>,
    mouseCoordinate: { x: number, y: number },
): fabric.Rect | null => {
    const answerDatas = answersCoordsMap.get(text);
    if (!answerDatas) return null;

    const correctAnswers = answerDatas.filter((answerData) => {
        // If removed from canvas, skip
        if (!answerData.canvas) return false;

        const answerTop = answerData.top ? answerData.top : 0;
        const answerLeft = answerData.left ? answerData.left : 0;
        const answerHeight = answerData.height ? answerData.height : 0;
        const answerWidth = answerData.width ? answerData.width : 0;

        return (mouseCoordinate.y >= answerTop && mouseCoordinate.y <= answerTop + answerHeight)
            && (mouseCoordinate.x >= answerLeft && mouseCoordinate.x <= answerLeft + answerWidth);
    });

    if (correctAnswers.length == 0) {
        return null;
    }

    return correctAnswers[0];
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

export const revealAnswerExternal = (
    canvas: fabric.Canvas,
    answerRect: fabric.Rect,
): void => {
    canvas.remove(answerRect);
};

export const showWrongAnswerIndicator = (
    canvas: fabric.Canvas,
    mouseCoordinate: { x: number, y: number },
): void => {
    const wrongAnswerIndicator = new QTCross({
        top: mouseCoordinate.y,
        left: mouseCoordinate.x,
    });

    canvas.add(wrongAnswerIndicator);
    wrongAnswerIndicator.animate('top', mouseCoordinate.y - 50, {
        duration: 500,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: function () {
            canvas.remove(wrongAnswerIndicator);
        },
    });

};

export const shiftAnswerOptionsUp = (
    canvas: fabric.Canvas,
    optionsCoordsMap: Map<string, fabric.Point>,
    text: fabric.Text,
): void => {
    const textContent = text.get('text');
    const heightTreshold = canvas.getHeight();
    if (!textContent) return;

    const coordToReplace = optionsCoordsMap.get(textContent);
    if (!coordToReplace) return;

    optionsCoordsMap.delete(textContent);
    const allObjects = canvas.getObjects();

    for (let idx = 0; idx < allObjects.length; idx++) {
        const object = allObjects[idx];
        if (object.type == 'QTText') {
            const top = object.top;
            if (!top) continue;
            const isTextOutOfBounds = top > heightTreshold;

            if (!isTextOutOfBounds) continue;

            const movedTextbox = object as fabric.Text;
            const movedTextboxText = movedTextbox.get('text');
            if (!movedTextboxText) continue;

            object.top = coordToReplace.y;
            object.setCoords();
            optionsCoordsMap.set(movedTextboxText, coordToReplace);
            break;
        }
    }
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


type BoundingRect = { top: number, left: number, width: number, height: number }
/**
 * Textbox position in a grouped selection will be relative to group instead of canvas, this converts the position
 * such that it comes relative to canvas.
 */
const getBoundingRectRelativeToCanvas = (textbox: fabric.Textbox): BoundingRect => {
    const textGroupLeft = textbox.group?.left;
    const textGroupWidth = textbox.group?.width;
    const textGroupTop = textbox.group?.top;
    const textGroupHeight = textbox.group?.height;
    const boundingRect = textbox.getBoundingRect();

    if (!textGroupWidth || !textGroupLeft || !textGroupTop || !textGroupHeight) {
        return boundingRect;
    }

    boundingRect.left = textGroupLeft + boundingRect.left + (textGroupWidth / 2);
    boundingRect.top = textGroupTop + boundingRect.top + (textGroupHeight / 2);
    return boundingRect;
};

export const mergeTextboxes = (canvas: fabric.Canvas, objects: fabric.Object[]): void => {
    const textboxes = objects.map(object => object as fabric.Textbox);
    if (textboxes.length <= 1) return;

    let mainTextbox = textboxes[0];
    for (let i = 1; i < textboxes.length; i++) {
        const otherTextbox = textboxes[i];

        const mainRect = getBoundingRectRelativeToCanvas(mainTextbox);
        const otherRect = getBoundingRectRelativeToCanvas(otherTextbox);

        const yDifference = Math.abs(mainRect.top - otherRect.top);
        const xDifference = Math.abs(mainRect.left - otherRect.left);
        const hasYOverlap = yDifference <= mainRect.height;
        const hasXOverlap = xDifference <= mainRect.width;
        let firstTextbox;
        let secondTextbox;

        if (!hasYOverlap && !hasXOverlap) {
            firstTextbox = mainRect.top + mainRect.left < otherRect.top + otherRect.left
                ? mainTextbox
                : otherTextbox;
            secondTextbox = firstTextbox == mainTextbox ? otherTextbox : mainTextbox;

        } else {
            const xOverlapPercentage = xDifference / mainRect.width;
            const yOverlapPercentage = yDifference / otherRect.width;

            firstTextbox = xOverlapPercentage > yOverlapPercentage
                ? mainRect.top <= otherRect.top
                    ? mainTextbox
                    : otherTextbox
                : mainRect.left <= otherRect.left
                    ? mainTextbox
                    : otherTextbox;
            secondTextbox = firstTextbox == mainTextbox ? otherTextbox : mainTextbox;
        }

        const firstTextContent = firstTextbox.text;
        const secondTextContent = secondTextbox.text;
        const topLeftPoint = [Math.min(mainRect.left, otherRect.left), Math.min(mainRect.top, otherRect.top)];
        const bottomRightPoint = [Math.max(mainRect.left + mainRect.width, otherRect.left + otherRect.width), Math.max(mainRect.top + mainRect.height, otherRect.top + otherRect.height)];

        if (!firstTextContent || !secondTextContent) {
            continue;
        }
        const combinedTextContent = firstTextContent.concat(` ${secondTextContent}`);
        const height = bottomRightPoint[1] - topLeftPoint[1];
        mainTextbox = new QTTextbox(combinedTextContent, {
            top: topLeftPoint[1],
            left: topLeftPoint[0],
            width: bottomRightPoint[0] - topLeftPoint[0],
            height: height,
            hasBorders: false,
            borderColor: colours.BLACK,
            backgroundColor: colours.WHITE,
            stroke: colours.BLACK,
            fontSize: FONT_SIZE,
            scaleX: mainTextbox.scaleX,
            scaleY: mainTextbox.scaleY,
        });
    }

    objects.forEach(object => canvas.remove(object));
    canvas.add(mainTextbox);
    canvas.discardActiveObject();
};
