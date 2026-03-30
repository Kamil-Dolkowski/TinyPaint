import { ToolBase } from './ToolBase.js';
import { Tool } from './Tool.js';

export class Pencil extends ToolBase {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.tool = Tool.PENCIL;
    }

    setTool() {
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "square";
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(currentX, currentY) {
        this.ctx.beginPath();
        this.ctx.fillRect(currentX, currentY, 1, 1);
        this.ctx.stroke();
    }

    pointermove(lastX, lastY, currentX, currentY, e = null) {
        this.ctx.save();

        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(currentX, currentY)
        this.ctx.stroke();

        this.ctx.restore();

        lastX = currentX;
        lastY = currentY;

        return {lastX: lastX, lastY: lastY};
    }

    pointerup(lastX, lastY, currentX, currentY, e = null) {

    }
}
