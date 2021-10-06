import { fabric } from 'fabric';

import colours from '../../utilities/colours';

const TEXT_MARGIN = 40;
const CANVAS_PADDING = 20;
const FONT_SIZE = 16;

// Image card generation utils
export const initAnswerOptions = (canvas: fabric.Canvas, isEditing: boolean): Map<string, fabric.Point> => {
    // TODO: Change to options from BE
    const MOCK_OPTIONS = ['Hypothalamus', 'Kangaroo', 'LongNameMedicalPartOfBodyBones', 'Short', 'SomeBones', 'OtherBones'];
    const optionsCoordsMap = new Map();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // TODO: Options for card that's editing
    if (isEditing) {
        MOCK_OPTIONS.forEach(option => {
            // Use textbox to allow edit
            const textbox = new fabric.Textbox(option);

            textbox.perPixelTargetFind = true;
            canvas.add(textbox);
        });
        return optionsCoordsMap;
    }

    // TODO: Make this dynamic
    const origin = new fabric.Point(CANVAS_PADDING, canvasHeight - CANVAS_PADDING);

    MOCK_OPTIONS.forEach(option => {
        const text = new fabric.Text(option);
        text.setPositionByOrigin(origin, 'left', 'top');


        const textWidth = text.getBoundingRect().width / 2;
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

        text.fontSize = FONT_SIZE;
        text.perPixelTargetFind = true;
        text.hasControls = text.hasBorders = false;
        canvas.add(text);
    });
    return optionsCoordsMap;
};

const MOCK_BOXES = [
    { top: 0, left: 0, width: 100, height: 100, label: 'text' },
    { top: 100, left: 50, width: 100, height: 100, label: 'brain' },
    { top: 200, left: 100, width: 100, height: 100, label: 'organ' },
];

export const initAnswerBoxes = (canvas: fabric.Canvas, isEditing: boolean): void => {
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

        canvas.add(textbox);
    });
};

// TODO: Implement answer validation
export const validateAnswer = (answerOption:fabric.Object):boolean => {
    const coords = answerOption.getCoords();
    return false;
};
