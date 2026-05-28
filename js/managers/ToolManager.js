import Tool from '../tools/Tool.js';

export default class ToolManager extends EventTarget {
    constructor(tools, firstTool, gesture, history, ctxToolbarManager) {
        super();
        
        this.tools = tools;
        this.gesture = gesture;
        this.ctxToolbarManager = ctxToolbarManager;

        this.currentTool = firstTool;
        this.lastTool = null;
        
        this.history = history;

        this.initToolButtonsEvents();
        this.setTool(firstTool);
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

    setTool(tool) {
        if (tool != this.currentTool) this.lastTool = this.currentTool;
        
        this.currentTool = tool;
        this.currentTool?.setTool();

        this.ctxToolbarManager.update(this.currentTool.toolControls);

        // event
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { settings: tool.settings }
            })
        );
    }

    setToolByName(toolName) {
        const tool = this.tools[toolName].tool;
        
        if (!tool) return;

        // set tool
        this.setTool(tool);

        // set button
        const button = this.tools[toolName].button;
        button.click();
        button.blur();
    }

    setLastTool() {
        if (!this.lastTool) return;

        this.setToolByName(this.lastTool.tool)
        this.lastTool = null;
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