import { ToolBase } from './ToolBase.js';
import { Tool } from './Tool.js';

export class Brush extends ToolBase {
    constructor(ctx, drawSize) {
        super();
        this.ctx = ctx;
        this.tool = Tool.BRUSH;
        this.brushSize = drawSize;
    }

    setTool() {
        this.ctx.lineWidth = this.drawSize;
        this.ctx.lineCap = "round";
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(currentX, currentY) {
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    pointermove(lastX, lastY, currentX, currentY, e = null) {
        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(currentX, currentY)
        this.ctx.stroke();

        lastX = currentX;
        lastY = currentY;

        return {lastX: lastX, lastY: lastY};
    }

    pointerup(lastX, lastY, currentX, currentY, e = null) {

    }
}
