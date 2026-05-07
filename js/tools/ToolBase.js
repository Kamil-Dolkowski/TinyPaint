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

    onInput(pointerData) {
        switch (pointerData.eventType) {
            case "pointerdown":
                this.pointerdown(pointerData);
                break;
            case "pointermove":
                this.pointermove(pointerData);
                break;
            case "pointerup":
                this.pointermove(pointerData);
                break;
        }
    }

    pointerdown(pointerData) {
        throw new Error('Method "pointerdown()" must be implemented');
    } 

    pointermove(pointerData) {
        throw new Error('Method "pointermove()" must be implemented');
    } 

    pointerup(pointerData) {
        throw new Error('Method "pointerup()" must be implemented');
    } 

    drawCursor(current) {
        throw new Error('Method "drawCursor()" must be implemented');
    }

    drawAnimationFrame(pointerData) {
        throw new Error('Method "drawAnimationFrame()" must be implemented');
    }
}