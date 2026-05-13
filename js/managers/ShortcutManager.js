export default class ShortcutManager {
    constructor(history) {
        this.history = history;

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
    }

    onKeyInput(keyData) {
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