import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Pencil extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.PENCIL, ctx, cursorCtx, drawingStatus);
    }

    setTool() {
        this.ctx.globalCompositeOperation = "source-over";
    }

    onInput(pointerData) {
        switch (pointerData.eventType) {
            case "pointerdown":
                this.pointerdown(pointerData);
                break;
            case "pointermove":
                this.pointermove(pointerData);
                break;
        }
    }

    pointerdown(pointerData) {
        const currentX = Math.floor(pointerData.current.x);
        const currentY = Math.floor(pointerData.current.y);

        this.ctx.fillRect(currentX, currentY, 1, 1);
    }

    pointermove(pointerData) {
        const x0 = pointerData.last.x;
        const y0 = pointerData.last.y;
        const x1 = pointerData.current.x;
        const y1 = pointerData.current.y;

        this.drawLine(x0, y0, x1, y1);
    }






    pointerdown1(e) {
        const currentX = Math.floor(this.drawingStatus.currentX);
        const currentY = Math.floor(this.drawingStatus.currentY);

        this.ctx.fillRect(currentX, currentY, 1, 1);
    }

    pointermove1(e) {
        const x0 = this.drawingStatus.lastX;
        const y0 = this.drawingStatus.lastY;
        const x1 = this.drawingStatus.currentX;
        const y1 = this.drawingStatus.currentY;

        this.drawLine(x0, y0, x1, y1);

        this.drawingStatus.lastX = this.drawingStatus.currentX;
        this.drawingStatus.lastY = this.drawingStatus.currentY;
    }

    pointerup1(e) {

    }

    drawCursor() {
        this.cursorCtx.clearRect(0, 0, this.drawingStatus.canvasWidth, this.drawingStatus.canvasHeight);

        const currentX = Math.floor(this.drawingStatus.currentX);
        const currentY = Math.floor(this.drawingStatus.currentY);

        this.cursorCtx.fillStyle = this.ctx.strokeStyle;

        this.cursorCtx.fillRect(currentX, currentY, 1, 1);
    }

    drawAnimationFrame() {
        
    }

    drawLine(x0, y0, x1, y1) {
        const points = this.bresenham(x0, y0, x1, y1);

        points.forEach(p => {
            this.ctx.fillRect(p.x, p.y, 1, 1);
        });
    }

    // Bresenham Algorithm - line drawing algorithm
    // source [pl]: https://eduinf.waw.pl/inf/prg/011_sdl2/0009.php
    bresenham(x0, y0, x1, y1) {
        let result = [];

        // points must be integers and they are at the middle of pixel
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        // x and y steps (steps direction)
        let sx = 1;
        let sy = 1;

        if (x0 > x1) {
            sx = -1;
        }
        if (y0 > y1) {
            sy = -1;
        }

        // deltas
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);

        result.push({x: x0, y: y0});

        if (dx < dy) {
            // for angles > 45 degrees to X Axis
            let err = dy/2;

            for (let i = 0; i < dy; i++) {
                y0 = y0 + sy;
                err = err - dx;

                if (err < 0) {
                    x0 = x0 + sx;
                    err = err + dy;

                    result.push({x: x0, y: y0});
                } else {
                    result.push({x: x0, y: y0});
                }
            } 
        } else {
            // for angles <= 45 degrees to X Axis
            let err = dx/2;

            for (let i = 0; i < dx; i++) {
                x0 = x0 + sx;
                err = err - dy;

                if (err < 0) {
                    y0 = y0 + sy;
                    err = err + dx;

                    result.push({x: x0, y: y0});
                } else {
                    result.push({x: x0, y: y0});
                }
            } 
        }

        return result;
    }
}
