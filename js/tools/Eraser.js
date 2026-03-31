import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Eraser extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.ERASER, ctx, cursorCtx, drawingStatus);
        // this.ctx = ctx;
        // this.tool = Tool.ERASER;
        // this.drawSize = drawSize;
    }

    setTool() {
        this.ctx.lineWidth = this.drawingStatus.drawSize;
        this.ctx.lineCap = "round";
        this.ctx.globalCompositeOperation = "destination-out";
    }

    pointerdown(e) {
        this.ctx.beginPath();
        this.ctx.arc(this.drawingStatus.currentX, this.drawingStatus.currentY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    pointermove(e) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.drawingStatus.lastX, this.drawingStatus.lastY);
        this.ctx.lineTo(this.drawingStatus.currentX, this.drawingStatus.currentY)
        this.ctx.stroke();

        this.drawingStatus.lastX = this.drawingStatus.currentX;
        this.drawingStatus.lastY = this.drawingStatus.currentY;
    }

    pointerup(e) {

    }

    drawAnimationFrame() {
        
    }
}
