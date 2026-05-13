export default class KeyboardManager {
    constructor(shortcutManager) {
        this.shortcutManager = shortcutManager;

        this.activeKeys = new Set();
    }

    onKeyDown(e) {
        this.activeKeys.add(e.code);

        const keyData = {
            eventType: "keydown",
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        };

        this.shortcutManager.onKeyInput(keyData);
    }

    onKeyUp(e) {
        this.activeKeys.delete(e.code);

        const keyData = {
            eventType: "keyup",
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        };

        this.shortcutManager.onKeyInput(keyData);
    }

    isPressed(keyCode) {
        return this.activeKeys.has(keyCode);
    }
}