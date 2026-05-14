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

    isLeftMouseButton(pointerData) {
        return pointerData.button === 0;
    }

    isMiddleMouseButton(pointerData) {
        return pointerData.button === 1;
    }

    isRightMouseButton(pointerData) {
        return pointerData.button === 2;
    }
}