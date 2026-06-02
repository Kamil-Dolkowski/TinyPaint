export default class ShortcutManager {
    constructor(canvas, history, toolManager) {
        this.canvas = canvas;
        this.history = history;
        this.toolManager = toolManager;

        // shortcuts - single action
        this.shortcuts = {
            undo: {
                code: "KeyZ",
                ctrlKey: true,
                action: () => this.history.undo()
            },
            redo: {
                code: "KeyY",
                ctrlKey: true,
                action: () => this.history.redo()
            },
            pencil: {
                code: "KeyP",
                action: () => this.toolManager.setToolByName("pencil")
            },
            brush: {
                code: "KeyB",
                action: () => this.toolManager.setToolByName("brush")
            },
            line: {
                code: "KeyL",
                action: () => this.toolManager.setToolByName("line")
            },
            eraser: {
                code: "KeyE",
                action: () => this.toolManager.setToolByName("eraser")
            },
            moveZoom: {
                code: "KeyM",
                action: () => this.toolManager.setToolByName("moveZoom")
            },
            eyedropper: {
                code: "KeyI",
                action: () => this.toolManager.setToolByName("eyedropper")
            },
            fitToScreen: {
                code: "KeyF",
                action: () => this.canvas.fitToScreen()
            },
        };
    }

    handle(keyData) {
        // shortcuts
        if (keyData.eventType == "keyup") return;

        for (const shortcut of Object.values(this.shortcuts)) {
            if (
                keyData.code === shortcut.code &&
                keyData.ctrlKey === !!shortcut.ctrlKey &&
                keyData.shiftKey === !!shortcut.shiftKey &&
                keyData.altKey === !!shortcut.altKey
            ) {
                shortcut.action();
                return;
            }
        }
    }
}