export default class GestureManager {
    constructor(canvas) {
        this.canvas = canvas;

        this.isGesture = false;
        this.isGesturePrev = false;

        // Transform Gesture Variables
        this.lastDistance = null;
        this.firstDistance = null;
        this.firstZoom = null;
        this.middlePoint = null;
    }

    update(activePointers) {
        return this.getGestureData(activePointers);
    }

    reset() {
        this.lastDistance = null;
        this.firstDistance = null;
        this.firstZoom = null;
        this.middlePoint = null;
    }

    // ========= GESTURES =========

    // transform - zoom and move
    getGestureData(activePointers) {
        if (activePointers.length == 0) {
            if (this.isGesture) this.isGesturePrev = true;
            this.isGesture = false;
        }

        if (activePointers.length != 2) {
            this.reset();

            if (!this.isGesture) {
                if (!this.isGesturePrev) return null;

                this.isGesturePrev = false;

                const gestureData = {
                    gesture: "transform",
                    phase: "end",
                    middlePoint: null,
                    zoomValue: null,
                    firstZoom: null,
                    delta: {x: 0, y: 0}
                };

                return gestureData;
            } else {
                const gestureData = {
                    gesture: "transform",
                    phase: "end",
                    middlePoint: null,
                    zoomValue: null,
                    firstZoom: null,
                    delta: {x: 0, y: 0}
                };

                return gestureData;
            }
        }

        const [p1, p2] = activePointers;
        const currentDistance = this.calcDistance(p1.client, p2.client);

        if (this.lastDistance === null) {
            this.isGesture = true;
            this.firstDistance = currentDistance;
            this.lastDistance = currentDistance;
            this.firstZoom = this.canvas.currentZoom;
            this.middlePoint = this.getMiddlePoint(p1.client, p2.client);

            const gestureData = {
                gesture: "transform",
                phase: "start",
                middlePoint: this.middlePoint,
                zoomValue: 1,
                firstZoom: this.firstZoom,
                delta: {x: 0, y: 0}
            };

            return gestureData;
        }

        // pinch / zoom
        const zoomValue = currentDistance / this.firstDistance;

        // pan / move
        const newMiddlePoint = this.getMiddlePoint(p1.client, p2.client);

        const dx = newMiddlePoint.x - this.middlePoint.x;
        const dy = newMiddlePoint.y - this.middlePoint.y;

        const gestureData = {
            gesture: "transform",
            phase: "update",
            middlePoint: newMiddlePoint,
            zoomValue: zoomValue,
            firstZoom: this.firstZoom,
            delta: {x: dx, y: dy}
        };

        this.lastDistance = currentDistance;
        this.middlePoint = newMiddlePoint;

        return gestureData;
    }

    // ========= OTHER METHODS =========

    calcDistance(p1, p2) {
        return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }

    getMiddlePoint(p1, p2) {
        return {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2}
    }
}