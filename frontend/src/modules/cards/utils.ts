import { fabric } from 'fabric';

import colours from '../../utilities/colours';

const TEXT_MARGIN = 40;
const TEXT_PADDING = 10;
const CANVAS_PADDING = 40;
const FONT_SIZE = 20;
const CORRECTNESS_MARGIN = 20;

// Image card generation utils
export const initAnswerOptions = (canvas: fabric.Canvas, isEditing: boolean): Map<string, fabric.Point> => {
    // TODO: Change to options from BE
    const MOCK_OPTIONS = ['Hypothalamus', 'Kangaroo', 'LongNameMedicalPartOfBodyBones', 'Short', 'SomeBones', 'OtherBones', 'organ', 'brain', 'text'];
    const optionsCoordsMap = new Map();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // TODO: Options for card that's editing, maybe don't even show options, as they can just edit the answerBoxes immediately
    if (isEditing) {
        MOCK_OPTIONS.forEach(option => {
            // Use textbox to allow edit
            const textbox = new fabric.Textbox(option);

            textbox.perPixelTargetFind = true;
            canvas.add(textbox);
        });
        return optionsCoordsMap;
    }

    const origin = new fabric.Point(CANVAS_PADDING, canvasHeight - CANVAS_PADDING);

    MOCK_OPTIONS.forEach(option => {
        const text = new fabric.Text(option, {
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

            optionsCoordsMap.set(option, new fabric.Point(origin.x, origin.y));
            text.setPositionByOrigin(origin, 'left', 'top');
            origin.setX(origin.x + textWidth + TEXT_MARGIN);

        } else {
            optionsCoordsMap.set(option, new fabric.Point(origin.x, origin.y));
            origin.setX(origin.x + textWidth + TEXT_MARGIN);
        }

        canvas.add(text);
    });
    return optionsCoordsMap;
};

const MOCK_BOXES = [
    { top: 0, left: 0, width: 100, height: 100, label: 'text' },
    { top: 100, left: 50, width: 100, height: 100, label: 'brain' },
    { top: 200, left: 100, width: 100, height: 100, label: 'organ' },
];

export const initAnswerBoxes = (canvas: fabric.Canvas, isEditing: boolean):Map<string,fabric.Point> => {
    const answersCoordsMap = new Map();

    if (isEditing) {
        MOCK_BOXES.forEach(box => {
            // Use textbox to allow edit
            const rect = new fabric.Rect({
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                borderColor: colours.BLACK,
                backgroundColor: colours.WHITE,
                stroke: colours.BLACK,
            });

            rect.drawBorders(canvas.getContext());
            answersCoordsMap.set(box.label, new fabric.Point(box.top, box.left));

            canvas.add(rect);
        });

    } else {
        MOCK_BOXES.forEach(box => {
            // Use textbox to allow edit
            const textbox = new fabric.Textbox(box.label, {
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                borderColor: colours.BLACK,
                backgroundColor: colours.WHITE,
                stroke: colours.BLACK,
            });

            textbox.drawBorders(canvas.getContext());
            answersCoordsMap.set(box.label, new fabric.Point(box.top, box.left));

            canvas.add(textbox);
        });
    }
    return answersCoordsMap;
};

export const validateAnswer = (answerOption:fabric.Text, answersCoordsMap:Map<string,fabric.Point>):boolean => {
    const optionTop = answerOption.top;
    const optionLeft = answerOption.left;
    if (!optionTop || !optionLeft) return false;

    const textContent = answerOption.get('text');
    if (!textContent) return false;

    const answerTopLeftPoint = answersCoordsMap.get(textContent);
    if (!answerTopLeftPoint) return false;

    return Math.abs(optionTop - answerTopLeftPoint.x) < CORRECTNESS_MARGIN
        && Math.abs(optionLeft - answerTopLeftPoint.y) < CORRECTNESS_MARGIN;
};
