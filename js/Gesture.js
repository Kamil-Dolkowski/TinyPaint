export default class Gesture {
    constructor(moveZoom, canvas) {
        this.activePointers = new Map(); // e.pointerId: {x: e.clientX, y: e.clientY}
        this.moveZoom = moveZoom;
        this.canvas = canvas;

        this.lastDistance = null;
        this.firstDistance = null;
        this.firstZoom = null;
        this.middlePoint = null;
    }

    pointermove(e) {
        // update pointer coords
        this.activePointers.set(e.pointerId, {x: e.clientX, y: e.clientY});

        if (this.activePointers.size == 2) {
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

    calcDistance() {
        if (this.activePointers.size != 2) return null;

        const [p1, p2] = [...this.activePointers.values()];
        return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }

    getMiddlePoint() {
        if (this.activePointers.size != 2) return null;

        const [p1, p2] = [...this.activePointers.values()];
        return {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2}
    }
}