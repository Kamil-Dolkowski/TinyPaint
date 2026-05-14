export default class ToolBase {
    constructor(tool, ctx, cursorCtx, drawingStatus) {
        this.tool = tool;
        this.ctx = ctx;
        this.cursorCtx = cursorCtx;
        this.drawingStatus = drawingStatus;
    }

    setTool() {}

    onInput(pointerData) {
        switch (pointerData.eventType) {
            case "pointerdown":
                this.pointerdown(pointerData);
                break;
            case "pointermove":
                this.pointermove(pointerData);
                break;
            case "pointerup":
                this.pointerup(pointerData);
                break;
        }
    }

    pointerdown(pointerData) {} 

    pointermove(pointerData) {} 

    pointerup(pointerData) {} 

    onWheel(e) {}

    drawCursor(current) {}

    drawAnimationFrame(pointerData) {}
}