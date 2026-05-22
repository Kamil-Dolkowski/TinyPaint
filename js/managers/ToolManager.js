import Tool from '../tools/Tool.js';

export default class ToolManager {
    constructor(tools, firstTool, gesture) {
        this.tools = tools;
        this.gesture = gesture;

        this.currentTool = firstTool;
        this.tempTool = null;
        
        this.history = null;

        this.initToolButtonsEvents();
    }

    initToolButtonsEvents() {
        // Set Tool actions
        Object.values(this.tools).forEach(tool => {
            tool.button.addEventListener("click", () => {
                this.setTool(tool.tool);
            });
        });

        // Radio Buttons logic
        Object.values(this.tools).forEach(tool => {
            tool.button.addEventListener("click", () => {
                Object.values(this.tools).forEach(tool => {
                    tool.button.dataset.state = "off";
                });

                tool.button.dataset.state = "on";
            });
        });
    }

    initHistory(history) {
        this.history = history;
    }

    setTool(tool) {
        this.currentTool = tool;
        this.currentTool?.setTool();
    }

    drawCursor(current) {
        this.currentTool?.drawCursor(current);
    }

    drawToolAnimation = () => {
        this.currentTool?.drawAnimationFrame();
        
        requestAnimationFrame(this.drawToolAnimation);
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