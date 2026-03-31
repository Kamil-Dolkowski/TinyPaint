import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Pencil extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.PENCIL, ctx, cursorCtx, drawingStatus);
    }

    setTool() {
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "square";
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(e) {
        this.ctx.beginPath();
        this.ctx.fillRect(this.drawingStatus.currentX, this.drawingStatus.currentY, 1, 1);
        this.ctx.stroke();
    }

    pointermove(e) {
        this.ctx.save();

        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(this.drawingStatus.lastX, this.drawingStatus.lastY);
        this.ctx.lineTo(this.drawingStatus.currentX, this.drawingStatus.currentY)
        this.ctx.stroke();

        this.ctx.restore();

        this.drawingStatus.lastX = this.drawingStatus.currentX;
        this.drawingStatus.lastY = this.drawingStatus.currentY;
    }

    pointerup(e) {

    }

    drawCursor() {
        this.cursorCtx.clearRect(0, 0, this.drawingStatus.canvasWidth, this.drawingStatus.canvasHeight);

        this.cursorCtx.save();
        this.cursorCtx.lineWidth = 1;
        this.cursorCtx.strokeStyle = "black"
        this.cursorCtx.restore();

        this.cursorCtx.beginPath();
        this.cursorCtx.arc(this.drawingStatus.currentX, this.drawingStatus.currentY, this.ctx.lineWidth / 2, 0, 2 * Math.PI);
        this.cursorCtx.stroke();
    }

    drawAnimationFrame() {
        
    }
}
