export class ToolBase {
    setTool(tool) {} // tool configuration
    startDrawing(currentX, currentY) {} // on 'mousedown'
    draw(lastX, lastY, currentX, currentY, e = null) {} // on 'mousemove'
    stopDrawing(lastX, lastY, currentX, currentY, e = null) {} // on 'mouseup' or 'mouseout'
}