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

    zoomIn(zoomPoint, zoomValue = this.zoomValue, firstZoom = null) {
        // ==== zoom ====
        const lastZoom = this.canvas.currentZoom;
        const isZoomDone = this.canvas.zoomBy(zoomValue, firstZoom);
        const currentZoom = this.canvas.currentZoom;
        
        if (isZoomDone == false) return;
        
        // ==== move ====
        const deltaZoomValue = (currentZoom/lastZoom);
        this.moveCanvasAfterZoom(zoomPoint, deltaZoomValue);
    }

    zoomOut(zoomPoint, zoomValue = 1/this.zoomValue, firstZoom = null) {
        // ==== zoom ====
        const lastZoom = this.canvas.currentZoom;
        const isZoomDone = this.canvas.zoomBy(zoomValue, firstZoom);
        const currentZoom = this.canvas.currentZoom;

        if (isZoomDone == false) return;
        
        // ==== move ====
        const deltaZoomValue = (currentZoom/lastZoom);
        this.moveCanvasAfterZoom(zoomPoint, deltaZoomValue);
    }

    moveCanvasAfterZoom(zoomPoint, deltaZoomValue) {
        // ==== move canvas after zoom to zoom to the point (cursor/middle point of touch) position ====

        // 1. calculate distances between: canvas (before zoom) top left point and cursor point
        const rect = this.canvas.cursorCanvas.getBoundingClientRect();

        let deltaX = zoomPoint.x - rect.left;
        let deltaY = zoomPoint.y - rect.top;

        // 2. calculate zoom distances = distance * deltaZoomValue
        const zoomX = deltaX * deltaZoomValue;
        const zoomY = deltaY * deltaZoomValue;

        // 3. calculate deltas to move
        deltaX = deltaX - zoomX;
        deltaY = deltaY - zoomY;

        // 4. move
        this.canvas.moveRelative(deltaX, deltaY);
    }
}