import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Brush extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.BRUSH, ctx, cursorCtx, drawingStatus);
    }

    setTool() {
        this.ctx.lineWidth = this.drawingStatus.drawSize;
        this.ctx.lineCap = "round";
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(pointerData) {
        this.ctx.beginPath();
        this.ctx.arc(pointerData.current.x, pointerData.current.y, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    pointermove(pointerData) {
        this.ctx.beginPath();
        this.ctx.moveTo(pointerData.last.x, pointerData.last.y);
        this.ctx.lineTo(pointerData.current.x, pointerData.current.y)
        this.ctx.stroke();

        // this.drawingStatus.lastX = this.drawingStatus.currentX;
        // this.drawingStatus.lastY = this.drawingStatus.currentY;
    }

    pointerup(pointerData) {

    }

    drawCursor(current) {
        this.cursorCtx.clearRect(0, 0, this.drawingStatus.canvasWidth, this.drawingStatus.canvasHeight);

        this.cursorCtx.save();
        this.cursorCtx.lineWidth = 1;
        this.cursorCtx.strokeStyle = "black"
        this.cursorCtx.restore();

        this.cursorCtx.beginPath();
        this.cursorCtx.arc(current.x, current.y, this.ctx.lineWidth / 2, 0, 2 * Math.PI);
        this.cursorCtx.stroke();
    }

    drawAnimationFrame() {
        
    }
}
