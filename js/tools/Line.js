import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Line extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.LINE, ctx, cursorCtx, drawingStatus);
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
        if (pointerData.shiftKey) {
            ({x: pointerData.current.x, y: pointerData.current.y} = this.getPerpendicularLineCoords(pointerData.last.x, pointerData.last.y, pointerData.current.x, pointerData.current.y));
        }
    }

    pointerup(pointerData) {
        if (pointerData.shiftKey) {
            ({x: pointerData.current.x, y: pointerData.current.y} = this.getPerpendicularLineCoords(pointerData.last.x, pointerData.last.y, pointerData.current.x, pointerData.current.y));
        }

        this.ctx.beginPath();
        this.ctx.moveTo(pointerData.last.x, pointerData.last.y);
        this.ctx.lineTo(pointerData.current.x, pointerData.current.y)
        this.ctx.stroke();
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

    drawAnimationFrame(pointerData) {
        this.cursorCtx.save();

        this.cursorCtx.lineWidth = this.ctx.lineWidth;
        this.cursorCtx.lineCap = "round";
        this.cursorCtx.strokeStyle = this.ctx.strokeStyle;

        this.cursorCtx.beginPath();
        this.cursorCtx.moveTo(pointerData.last.x, pointerData.last.y);
        this.cursorCtx.lineTo(pointerData.current.x, pointerData.current.y)
        this.cursorCtx.stroke();

        this.cursorCtx.restore();
    }

    getPerpendicularLineCoords(originX, originY, currentX, currentY) {
        // 1. create 2 points by crossing coordinates
        // 2. select the closest point to the current point

        const current = {x: currentX, y: currentY};
        const point1 = {x: originX, y: currentY};
        const point2 = {x: currentX, y: originY};

        const distance1 = (point1.x - current.x) ** 2 + (point1.y - current.y) ** 2
        const distance2 = (point2.x - current.x) ** 2 + (point2.y - current.y) ** 2

        if (distance1 < distance2) {
            return {x: point1.x, y: point1.y};
        } else {
            return {x: point2.x, y: point2.y};
        }
    }
}