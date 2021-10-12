import { fabric } from 'fabric';

import colours from '../../utilities/colours';

// Bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf)
const BEIZER_APPROXIMATION = 1 - 0.5522847498;

const QTText = fabric.util.createClass(fabric.Text, {
    type: 'QTText',

    // initialize can be of type function(options) or function(property, options), like for text.
    // no other signatures allowed.
    initialize: function (text:string, options:any) {
        this.text = text;
        options || (options = {});

        this.callSuper('initialize', text, options);
        this.set('willShowBorder', options.willShowBorder || true);
        this.set('rx', options.rx || 0);
        this.set('ry', options.ry || 0);
        this.set('willShowBoxShadow', options.willShowBoxShadow || true);
        this.set('boxShadowColor', options.boxShadowColor || colours.BLUE);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            willShowBorder: this.get('willShowBorder'),
            rx: this.get('rx'),
            ry: this.get('ry'),
            padding: this.get('padding'),
            willShowBoxShadow: this.get('willShowBoxShadow'),
            boxShadowColor: this.get('boxShadowColor'),
        });
    },

    _render: function (ctx:any) {
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

        if (this.willShowBoxShadow) {
            ctx.beginPath();

            ctx.moveTo(x + w - rx + 1, y + 1);
            isRounded &&
                ctx.bezierCurveTo((x + w - k * rx) + 1, y + 1, x + w + 1, (y + k * ry) + 1, x + w + 1, y + ry + 1);

            // ctx.moveTo(x + w + 1, y + h - ry + 1);
            isRounded &&
                ctx.bezierCurveTo(
                    x + w + 1,
                    (y + h - k * ry) + 1,
                    (x + w - k * rx) + 1,
                    y + h + 1,
                    x + w - rx + 1,
                    y + h + 1,
                );

            ctx.lineTo(x + rx + 1, y + h + 1);
            isRounded &&
                ctx.bezierCurveTo((x + k * rx) + 1, y + h + 1, x + 1, (y + h - k * ry) + 1, x + 1, (y + h - ry) + 1);

            const shadowStroke = ctx.strokeStyle;
            ctx.strokeStyle = this.boxShadowColor;
            ctx.stroke();
            ctx.strokeStyle = shadowStroke;
        }
    },
});

export default QTText;
