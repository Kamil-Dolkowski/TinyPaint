import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Pencil extends ToolBase {
    constructor(canvas, drawingStatus) {
        super(Tool.PENCIL, canvas, drawingStatus);

        this.toolControls = ["palette", "alpha"];
    }

    setTool() {
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        const currentX = Math.floor(pointerData.canvas.current.x);
        const currentY = Math.floor(pointerData.canvas.current.y);

        this.ctx.fillRect(currentX, currentY, 1, 1);
    }

    pointermove(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        const x0 = pointerData.canvas.last.x;
        const y0 = pointerData.canvas.last.y;
        const x1 = pointerData.canvas.current.x;
        const y1 = pointerData.canvas.current.y;

        this.drawLine(x0, y0, x1, y1);
    }

    pointerup(pointerData) {

    }

    drawCursor(current) {
        this.canvas.clearCursorCanvas();

        const currentX = Math.floor(current.x);
        const currentY = Math.floor(current.y);

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
