import { fabric } from 'fabric';

// Bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf)
const BEIZER_APPROXIMATION = 1 - 0.5522847498;

const Quizbox = fabric.util.createClass(fabric.Textbox, {
    // This type naming capitalization matters
    type: 'Quizbox',

    initialize: function (text: string, options: any) {
        this.text = text;
        this.callSuper('initialize', text, options);

        options || (options = {});
        this.set('willShowBorder', options.willShowBorder || true);
        this.set('onClickCallback', options.onClickCallback);
    },

    _computeWidthAndHeight: function () {
        this.clearContextTop();
        this._clearCache();
        this.dynamicMinWidth = 0;

        // wrap lines
        this._styleMap = this._generateStyleMap(this._splitText());
        if (this.textAlign.indexOf('justify') !== -1) {
            // once text is measured we need to make space fatter to make justified text.
            this.enlargeSpaces();
        }

        // clear cache and re-calculate height
        this.dynamicMinHeight = this.calcTextHeight();
    },

    _binarySearchFitWidthAndHeight: function (maxWidth: number, maxHeight: number) {
        let upperFontSize = this.fontSize;
        let lowerFontSize = 0;
        let midFontSize = lowerFontSize + Math.floor((upperFontSize - lowerFontSize) / 2);

        const fitWidthAndHeightFunc = (fontSize: number) => {
            this.fontSize = fontSize;
            this._computeWidthAndHeight();
            return this.dynamicMinWidth <= maxWidth && this.dynamicMinHeight <= maxHeight;
        };

        while (lowerFontSize < upperFontSize - 1) {
            midFontSize = lowerFontSize + Math.floor((upperFontSize - lowerFontSize) / 2);
            const isFit = fitWidthAndHeightFunc(midFontSize);
            if (isFit) {
                lowerFontSize = midFontSize;
            } else {
                upperFontSize = midFontSize;
            }
        }

        midFontSize = lowerFontSize + Math.floor((upperFontSize - lowerFontSize) / 2);
        fitWidthAndHeightFunc(midFontSize);

        return midFontSize;
    },

    // Overwrites parent's initDimensions method, to fit text into bounding box
    // ref: https://github.com/fabricjs/fabric.js/blob/2eabc92a3221dd628576b1bb029a5dc1156bdc06/src/shapes/textbox.class.js#L87
    initDimensions: function () {
        if (this.__skipDimension) {
            return;
        }
        this.isEditing && this.initDelayedCursor();
        // Dynamic min width and dynamic min height are the width and height for the text
        this.dynamicMinWidth = 0;
        this.dynamicMinHeight = 0;

        if (this.width && this.height) {
            // Calculation of suitable fontsize to fit width and height done in this method
            // Method will update dynamicMinWidth and dynamicMinHeight
            this._binarySearchFitWidthAndHeight(this.width, this.height);
        } else {
            this._computeWidthAndHeight();

            // If width and height empty, set initial height and width to computed ones
            // e.g. for empty textbox
            this.height = this.dynamicMinHeight;
            this.width = this.dynamicMinWidth;
        }

        this.saveState({ propertySet: '_dimensionAffectingProps' });
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            text: this.get('text'),
        });
    },

    _render: function (ctx: any) {
        this.callSuper('_render', ctx);
        const rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
            ry = this.ry ? Math.min(this.ry, this.height / 2) : 0,
            w = this.width + this.padding,
            h = this.height + this.padding,
            x = -this.width / 2 - this.padding / 2,
            y = -this.height / 2 - this.padding / 2,
            isRounded = rx !== 0 || ry !== 0,
            k = BEIZER_APPROXIMATION;

        // Draw border
        if (this.willShowBorder) {
            ctx.beginPath();
            ctx.moveTo(x + rx, y);

            ctx.lineTo(x + w - rx, y);
            isRounded &&
                ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);

            ctx.lineTo(x + w, y + h - ry);
            isRounded &&
                ctx.bezierCurveTo(
                    x + w,
                    y + h - k * ry,
                    x + w - k * rx,
                    y + h,
                    x + w - rx,
                    y + h,
                );

            ctx.lineTo(x + rx, y + h);
            isRounded &&
                ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);

            ctx.lineTo(x, y + ry);
            isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);

            ctx.closePath();
            const stroke = ctx.strokeStyle;
            ctx.strokeStyle = this.textboxBorderColor;
            ctx.stroke();
            ctx.strokeStyle = stroke;
        }
    },

    // Can add custom button as part of QTTextbox, however might have issues with style consistency when resizing...
    _mouseDownHandler: function (options: any) {
        this.onClickCallback && this.onClickCallback();
        if (!this.onClickCallback) {
            this.callSuper('_mouseDownHandler', options);
        }
    },

    _renderTextCommon: function (ctx: CanvasRenderingContext2D, method: any) {
        ctx.save();
        let lineHeights = 0;
        const left = this._getLeftOffset();
        const top = this._getTopOffset();
        for (let i = 0, len = this._textLines.length; i < len; i++) {
            const heightOfLine = this.getHeightOfLine(i),
                maxHeight = heightOfLine / this.lineHeight,
                leftOffset = this._getLineLeftOffset(i);
            this._renderTextLine(
                method,
                ctx,
                this._textLines[i],
                left + leftOffset,
                top + lineHeights + maxHeight,
                i,
            );
            lineHeights += heightOfLine;
        }
        ctx.restore();
    },
});

// Declare it so that fabric knows that Quizbox exists
(fabric as any).Quizbox = Quizbox;
(fabric as any).Quizbox.fromObject = function (object: any, callback: () => void) {
    return fabric.Object._fromObject('Quizbox', object, callback, 'text');
};
fabric.Object.NUM_FRACTION_DIGITS = 17;

export default Quizbox;
