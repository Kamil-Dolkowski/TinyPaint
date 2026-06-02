export default class ShortcutManager {
    constructor(canvas, history, toolManager) {
        this.canvas = canvas;
        this.history = history;
        this.toolManager = toolManager;

        // shortcuts - single action
        this.shortcuts = {
            ctrlZ: {
                code: "KeyZ",
                ctrlKey: true,
                action: () => this.history.undo()
            },
            ctrlY: {
                code: "KeyY",
                ctrlKey: true,
                action: () => this.history.redo()
            },
            p: {
                code: "KeyP",
                action: () => this.toolManager.setToolByName("pencil")
            },
            b: {
                code: "KeyB",
                action: () => this.toolManager.setToolByName("brush")
            },
            l: {
                code: "KeyL",
                action: () => this.toolManager.setToolByName("line")
            },
            e: {
                code: "KeyE",
                action: () => this.toolManager.setToolByName("eraser")
            },
            m: {
                code: "KeyM",
                action: () => this.toolManager.setToolByName("moveZoom")
            },
            i: {
                code: "KeyI",
                action: () => this.toolManager.setToolByName("eyedropper")
            },
            f: {
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