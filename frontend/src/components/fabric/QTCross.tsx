import { fabric } from 'fabric';

import colours from '../../utilities/colours';

const QTCross = fabric.util.createClass(fabric.Object, {
    type: 'QTCross',

    initialize: function (options: any) {
        this.callSuper('initialize', options);

        this.width = 50;
        this.height = 50;

        this.w1 = this.h2 = 50;
        this.h1 = this.w2 = 15;
    },

    _render: function (ctx: any) {
        ctx.rotate(45 * Math.PI / 180);
        ctx.fillStyle = colours.RED;
        ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1);
        ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2);
    },
});

// Declare it so that fabric knows that Quizbox exists
(fabric as any).QTCross = QTCross;
(fabric as any).QTCross.fromObject = function (object:any, callback: () => void) {
    return fabric.Object._fromObject('QTCross', object, callback);
};
fabric.Object.NUM_FRACTION_DIGITS = 17;

export default QTCross;
