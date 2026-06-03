import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class MoveZoom extends ToolBase {
    constructor(canvas, drawingState) {
        super(Tool.MOVE_ZOOM, canvas, drawingState);

        this.canvas = canvas;
        this.zoomValue = 1.5;

        this.wheelSum = 0;
    }

    setTool() {
        
    }

    pointerdown(pointerData) {
        
    } 

    pointermove(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        this.canvas.moveRelative(pointerData.client.delta.x, pointerData.client.delta.y);
    } 

    pointerup(pointerData) {
        
    } 

    onWheel(e) {
        this.wheelSum += Math.abs(e.deltaY);

        if (this.wheelSum < 120) return;
        this.wheelSum = 0;

        if (e.deltaY < 0) {
            const zoomPoint = {x: e.clientX, y: e.clientY};
            this.zoomIn(zoomPoint);
        } else {
            const zoomPoint = {x: e.clientX, y: e.clientY};
            this.zoomOut(zoomPoint);
        }
    }

    drawCursor(current) {
        
    }

    drawAnimationFrame() {
        
    }

    gesturemove(gestureData) {
        this.canvas.moveRelative(gestureData.delta.x, gestureData.delta.y);
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