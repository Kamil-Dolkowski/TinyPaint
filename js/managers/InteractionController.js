export default class InteractionController {
    constructor(toolManager) {
        this.toolManager = toolManager;
        this.isGesture = false;
    }

    onInput(pointerData, gestureData, pointerCount) {
        // reset/end gesture
        if (this.isGesture && pointerCount == 0) {
            this.isGesture = false;
        }

        if (gestureData) {
            this.isGesture = true;
            this.toolManager.onInputGesture(gestureData);
        } else {
            if (pointerData.eventType == "pointerdown") {
                setTimeout(() => {
                    if (!this.isGesture) {
                        this.toolManager.onInputPointer(pointerData);
                    }
                }, 20);

                return;
            }

            if (!this.isGesture) {
                this.toolManager.onInputPointer(pointerData);
            }
        }
    }
}