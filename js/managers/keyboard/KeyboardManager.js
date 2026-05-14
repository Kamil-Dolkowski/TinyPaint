export default class KeyboardManager {
    constructor(shortcutManager, holdActionManager) {
        this.shortcutManager = shortcutManager;
        this.holdActionManager = holdActionManager;

        this.activeKeys = new Set();

        // events
        window.addEventListener("keydown", e => {
            this.onKeyDown(e);
        });

        window.addEventListener("keyup", e => {
            this.onKeyUp(e);
        });

        window.addEventListener("blur", () => {
            this.activeKeys.clear();
        });
    }

    onKeyDown(e) {
        this.activeKeys.add(e.code);

        const keyData = {
            eventType: "keydown",
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey
        };

        this.shortcutManager.handle(keyData);
        this.holdActionManager.handle(keyData);
    }

    onKeyUp(e) {
        this.activeKeys.delete(e.code);

        const keyData = {
            eventType: "keyup",
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey
        };

        this.shortcutManager.handle(keyData);
        this.holdActionManager.handle(keyData);
    }

    // unused - other concept
    /*
    isPressed(code) {
        return this.activeKeys.has(code);
    }

    anyPressed(...codes) {
        return codes.some(code => this.activeKeys.has(code));
    }

    allPressed(...codes) {
        return codes.every(code => this.activeKeys.has(code));
    }
    */
}