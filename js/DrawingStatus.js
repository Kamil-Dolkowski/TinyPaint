class DrawingStatus {
    constructor() {
        if (!DrawingStatus.instance) {
            DrawingStatus.instance = this;

            this.isDrawing = false;

            this.lastX = null;
            this.lastY = null;

            this.currentX = null;
            this.currentY = null;

            this.drawSize = 5;
        }

        return DrawingStatus.instance;
    }
}

const drawingStatus = new DrawingStatus();
export default drawingStatus;