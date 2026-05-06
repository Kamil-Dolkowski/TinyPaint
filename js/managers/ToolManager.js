export default class ToolManager {
    constructor(firstTool, gesture) {
        this.currentTool = firstTool;
        this.tempTool = null;
        this.gesture = gesture;
    }

    setTool(tool) {
        this.currentTool = tool;
        this.currentTool?.setTool();
    }

    onInputPointer(pointerData) {
        this.currentTool?.onInput(pointerData);
    }

    onInputGesture(gestureData) {
        this.gesture?.onInput(gestureData);
    }
}