import { ToolBase } from './ToolBase.js';
import { Tool } from './Tool.js';

export class Line extends ToolBase {
    constructor(ctx, drawSize) {
        super();
        this.ctx = ctx;
        this.tool = Tool.LINE;
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
        if (e.shiftKey) {
            ({x: currentX, y: currentY} = getPerpendicularLineCoords(lastX, lastY, currentX, currentY));
        }

        return {currentX: currentX, currentY: currentY};
    }

    pointerup(lastX, lastY, currentX, currentY, e = null) {
        if (e.shiftKey) {
            var {x: currentX, y: currentY} = getPerpendicularLineCoords(lastX, lastY, currentX, currentY);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(currentX, currentY)
        this.ctx.stroke();

        return {currentX: currentX, currentY: currentY};
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