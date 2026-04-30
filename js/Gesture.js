import Tool from './tools/Tool.js';

export default class Gesture {
    constructor(moveZoom, canvas, drawingStatus) {
        this.activePointers = new Map(); // e.pointerId: {x: e.clientX, y: e.clientY}
        this.moveZoom = moveZoom;
        this.canvas = canvas;
        this.drawingStatus = drawingStatus;

        this.lastDistance = null;
        this.firstDistance = null;
        this.firstZoom = null;
        this.middlePoint = null;
    }

    pointermove(e) {
        if (this.drawingStatus.currentTool.tool == Tool.MOVE_ZOOM) return;

        // update pointer coords
        this.activePointers.set(e.pointerId, {x: e.clientX, y: e.clientY});

        // ==== zoom and move ====
        if (this.activePointers.size == 2) {
            // ==== zoom ====
            const currentDistance = this.calcDistance();

            if (this.lastDistance === null) {
                this.firstDistance = currentDistance;
                this.lastDistance = currentDistance;
                this.firstZoom = this.canvas.currentZoom;
                this.middlePoint = this.getMiddlePoint();
                return;
            }

            const zoomValue = currentDistance / this.firstDistance;

            if (currentDistance > this.lastDistance) {
                this.moveZoom.zoomIn(this.middlePoint, zoomValue, this.firstZoom);
            } else {
                this.moveZoom.zoomOut(this.middlePoint, zoomValue, this.firstZoom);
            }

            this.lastDistance = currentDistance;

            // ==== move ====
            const newMiddlePoint = this.getMiddlePoint();

            if (this.calcDistance(newMiddlePoint, this.middlePoint) > 1) {
                const dx = newMiddlePoint.x - this.middlePoint.x;
                const dy = newMiddlePoint.y - this.middlePoint.y;

                this.canvas.moveRelative(dx, dy);

                this.middlePoint = newMiddlePoint;
            }
        }
    }

    addPointer(e) {
        this.activePointers.set(e.pointerId, {x: e.clientX, y: e.clientY});
    }

    deletePointer(e) {
        this.activePointers.delete(e.pointerId);

        if (this.activePointers.size < 2) {
            this.lastDistance = null;
            this.firstDistance = null;
            this.firstZoom = null;
            this.middlePoint = null;
        }
    }

    calcDistance(p1 = null, p2 = null) {
        if (this.activePointers.size != 2) return null;

        if (p1 == null || p2 == null) [p1, p2] = [...this.activePointers.values()];
        return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }

    getMiddlePoint() {
        if (this.activePointers.size != 2) return null;

        const [p1, p2] = [...this.activePointers.values()];
        return {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2}
    }
}