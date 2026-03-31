export default class ToolBase {
    constructor(tool, ctx, cursorCtx, drawingStatus) {
        this.tool = tool;
        this.ctx = ctx;
        this.cursorCtx = cursorCtx;
        this.drawingStatus = drawingStatus;
    }

    setTool() {
        throw new Error('Method "setTool()" must be implemented');
    }

    pointerdown(e) {
        throw new Error('Method "pointerdown()" must be implemented');
    } 

    pointermove(e) {
        throw new Error('Method "pointermove()" must be implemented');
    } 

    pointerup(e) {
        throw new Error('Method "pointerup()" must be implemented');
    } 

    drawAnimationFrame() {
        throw new Error('Method "drawAnimationFrame()" must be implemented');
    }
}