import Tool from '../tools/Tool.js';

export default class ToolManager extends EventTarget {
    constructor(tools, firstTool, gesture, history, ctxToolbarManager) {
        super();
        
        this.tools = tools;
        this.gesture = gesture;
        this.ctxToolbarManager = ctxToolbarManager;

        this.currentTool = firstTool;
        this.lastTools = [];
        
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

    setTool(tool, rememberHistory = false) {
        if (rememberHistory) {
            if (tool != this.currentTool) {
                this.lastTools.push(this.currentTool);
            }
        }
        
        this.currentTool = tool;
        this.currentTool?.setTool();

        this.ctxToolbarManager.update(this.currentTool.toolControls);
        this.currentTool.canvas.clearCursorCanvas();

        // event
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { settings: tool.settings }
            })
        );
    }

    setToolByName(toolName, rememberHistory = false) {
        const tool = this.tools[toolName].tool;
        
        if (!tool) return;

        // set tool
        this.setTool(tool, rememberHistory);

        // set button
        const button = this.tools[toolName].button;
        button.click();
        button.blur();
    }

    setLastTool() {
        if (this.lastTools.length == 0) return;

        const lastTool = this.lastTools.pop();
        this.setToolByName(lastTool.tool)
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