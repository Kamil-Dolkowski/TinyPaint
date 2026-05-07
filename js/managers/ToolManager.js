import Tool from '../tools/Tool.js';

export default class ToolManager {
    constructor(firstTool, gesture) {
        this.currentTool = firstTool;
        this.tempTool = null;
        this.gesture = gesture;
        this.history = null;
    }

    initHistory(history) {
        this.history = history;
    }

    setTool(tool) {
        this.currentTool = tool;
        this.currentTool?.setTool();
    }

    onInputPointer(pointerData) {
        this.currentTool?.onInput(pointerData);

        if (pointerData.eventType == "pointerup") {
            this.saveToHistory();
        }
    }

    onInputGesture(gestureData) {
        const tempTool = this.currentTool;
        this.currentTool = this.gesture.moveZoom;

        this.gesture?.onInput(gestureData);

        this.currentTool = tempTool;
    }

    saveToHistory() {
        if (this.currentTool.tool != Tool.MOVE_ZOOM) {
            this.history.addCanvasToHistory();
        }
    }
}