import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class MoveZoom extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus, canvas) {
        super(Tool.MOVE_ZOOM, ctx, cursorCtx, drawingStatus);

        this.canvas = canvas;
        this.zoomValue = 1.5;
    }

    setTool() {
        
    }

    pointerdown(e) {
        
    } 

    pointermove(e) {
        const deltaX = (this.drawingStatus.currentX - this.drawingStatus.lastX) * this.canvas.currentZoom;
        const deltaY = (this.drawingStatus.currentY - this.drawingStatus.lastY) * this.canvas.currentZoom;

        this.canvas.moveRelative(deltaX, deltaY);
    } 

    pointerup(e) {
        
    } 

    drawCursor() {
        
    }

    drawAnimationFrame() {
        
    }

    zoomIn(e) {
        // ==== move canvas to zoom to the cursor position ====

        // 1. calculate distances between: canvas (before zoom) top left point and cursor point
        const rect = this.canvas.cursorCanvas.getBoundingClientRect();

        let deltaX = e.clientX - rect.left;
        let deltaY = e.clientY - rect.top;

        // 2. calculate zoom distances = distance * zoomValue
        const zoomX = deltaX * this.zoomValue;
        const zoomY = deltaY * this.zoomValue;

        // 3. calculate deltas to move
        deltaX = deltaX - zoomX;
        deltaY = deltaY - zoomY;

        // 4. move
        this.canvas.moveRelative(deltaX, deltaY);

        // ==== zoom ====
        this.canvas.zoomBy(this.zoomValue);
    }

    zoomOut(e) {
        // ==== move canvas to zoom to the cursor position ====

        // 1. calculate distances between: canvas (before zoom) top left point and cursor point
        const rect = this.canvas.cursorCanvas.getBoundingClientRect();

        let deltaX = e.clientX - rect.left;
        let deltaY = e.clientY - rect.top;

        // 2. calculate zoom distances = distance * zoomValue
        const zoomX = deltaX / this.zoomValue;
        const zoomY = deltaY / this.zoomValue;

        // 3. calculate deltas to move
        deltaX = deltaX - zoomX;
        deltaY = deltaY - zoomY;

        // 4. move
        this.canvas.moveRelative(deltaX, deltaY);

        // ==== zoom ====
        this.canvas.zoomBy(1/this.zoomValue);
    }
}