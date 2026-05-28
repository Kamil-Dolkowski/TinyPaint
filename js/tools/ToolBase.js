export default class ToolBase {
    constructor(tool, canvas, drawingStatus) {
        this.tool = tool;
        this.canvas = canvas;
        this.drawingStatus = drawingStatus;

        this.ctx = canvas.ctx;
        this.cursorCtx = canvas.cursorCtx;

        this.toolControls = [];
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

    isPrimaryAction(pointerData) {
        return pointerData.button === 0;
    }

    isMiddleAction(pointerData) {
        return pointerData.button === 1;
    }

    isSecondaryAction(pointerData) {
        return pointerData.button === 2;
    }
}