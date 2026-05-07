export default class InteractionController {
    constructor(toolManager) {
        this.toolManager = toolManager;
        this.isGesture = false;
    }

    onInput(pointerData, gestureData) {
        if (gestureData) {
            this.isGesture = true;

            if (gestureData.phase != "end") {
                this.toolManager.onInputGesture(gestureData);
            }
        } else {
            this.isGesture = false;

            // delay for pointerdown
            if (pointerData.eventType == "pointerdown") {
                setTimeout(() => {
                    if (!this.isGesture) {
                        this.toolManager.onInputPointer(pointerData);
                    }
                }, 20);

                return;
            }

            this.toolManager.onInputPointer(pointerData);
        }
    }
}