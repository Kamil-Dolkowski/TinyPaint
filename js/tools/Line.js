import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Line extends ToolBase {
    constructor(canvas, drawingState) {
        super(Tool.LINE, canvas, drawingState);
        this.last = null;
        this.current = null;

        this.toolControls = ["palette", "size", "alpha"];
    }

    setTool() {
        this.ctx.lineWidth = this.drawingState.drawSize;
        this.ctx.lineCap = "round";
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        this.last = pointerData.canvas.current;
        this.current = pointerData.canvas.current;
    }

    pointermove(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        if (!this.last) return;
        this.current = pointerData.canvas.current;

        if (pointerData.shiftKey) {
            ({x: this.current.x, y: this.current.y} = this.getPerpendicularLineCoords(this.last.x, this.last.y, this.current.x, this.current.y));
        }
    }

    pointerup(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        if (!this.last) return;
        this.current = pointerData.canvas.current;

        if (pointerData.shiftKey) {
            ({x: this.current.x, y: this.current.y} = this.getPerpendicularLineCoords(this.last.x, this.last.y, this.current.x, this.current.y));
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.last.x, this.last.y);
        this.ctx.lineTo(this.current.x, this.current.y);
        this.ctx.stroke();

        this.last = null;
        this.current = null;
    }

    drawCursor(current) {
        this.canvas.clearCursorCanvas();

        this.cursorCtx.save();
        this.cursorCtx.lineWidth = 1;
        this.cursorCtx.strokeStyle = "black"
        this.cursorCtx.restore();

        this.cursorCtx.beginPath();
        this.cursorCtx.arc(current.x, current.y, this.ctx.lineWidth / 2, 0, 2 * Math.PI);
        this.cursorCtx.stroke();
    }

    drawAnimationFrame() {
        this.canvas.clearCursorCanvas();
        
        if (this.last == null || this.current == null) return;
        
        this.cursorCtx.save();

        this.cursorCtx.lineWidth = this.ctx.lineWidth;
        this.cursorCtx.lineCap = "round";
        this.cursorCtx.strokeStyle = this.ctx.strokeStyle;

        this.cursorCtx.beginPath();
        this.cursorCtx.moveTo(this.last.x, this.last.y);
        this.cursorCtx.lineTo(this.current.x, this.current.y);
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