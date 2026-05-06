export default class InteractionController {
    constructor(toolManager) {
        this.toolManager = toolManager;
    }

    onInput(pointerData, gestureData) {
        if (gestureData) {
            this.toolManager.onInputGesture(gestureData);
        } else {
            this.toolManager.onInputPointer(pointerData);
        }
    }
}