export default class ShortcutManager {
    constructor(history, toolManager) {
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
        };

        // holdActions - constant action
        this.holdActions = {
            ctrl: {
                code: "ControlLeft",
                keydownAction: () => console.log("moveZoom"),
                keyupAction: () => console.log("default")
            }
        }
    }

    onKeyInput(keyData) {
        // holdActions
        for (const holdAction of Object.values(this.holdActions)) {
            if (keyData.code === holdAction.code) {
                if (keyData.eventType == "keydown") {
                    holdAction.keydownAction();
                } else {
                    holdAction.keyupAction();
                }
            }
        }
        
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