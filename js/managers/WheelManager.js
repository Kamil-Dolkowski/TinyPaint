export default class WheelManager {
    constructor(toolManager) {
        this.toolManager = toolManager;

        window.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    }

    onWheel(e) {
        e.preventDefault();
        this.toolManager.currentTool?.onWheel(e);
    }
}