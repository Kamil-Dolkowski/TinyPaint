class DrawingStatus {
    isDrawing = false;

    lastX = null;
    lastY = null;

    currentX = null;
    currentY = null;

    drawSize = 5;

    canvasWidth = null;
    canvasHeight = null;

    currentTool = null;
}

export default new DrawingStatus();