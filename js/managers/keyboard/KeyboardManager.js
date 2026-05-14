export default class KeyboardManager {
    constructor(shortcutManager, holdActionManager) {
        this.shortcutManager = shortcutManager;
        this.holdActionManager = holdActionManager;

        // events
        window.addEventListener("keydown", e => {
            this.onKeyDown(e);
        });

        window.addEventListener("keyup", e => {
            this.onKeyUp(e);
        });
    }

    onKeyDown(e) {
        const keyData = this.buildKeyData(e, "keydown");

        this.shortcutManager.handle(keyData);
        this.holdActionManager.handle(keyData);
    }

    onKeyUp(e) {
        const keyData = this.buildKeyData(e, "keyup");

        this.shortcutManager.handle(keyData);
        this.holdActionManager.handle(keyData);
    }

    buildKeyData(e, type) {
        return {
            eventType: type,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey
        };
    }
}