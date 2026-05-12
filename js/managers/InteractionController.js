export default class InteractionController {
    constructor(toolManager) {
        this.toolManager = toolManager;

        this.isGesture = false;

        this.pointerdownData = null;
        this.lastPointerData = null;
        this.maybeDraw = false;
    }

    onInput(pointerData, gestureData) {
        if (gestureData) {
            this.isGesture = true;

            if (gestureData.phase != "end") {
                this.toolManager.onInputGesture(gestureData);
            }
        } else {
            this.isGesture = false;

            // touch logic
            if (pointerData.pointerType == "touch") {

                // delay for pointerdown
                if (pointerData.eventType == "pointerdown") {
                    this.maybeDraw = true;
                    this.pointerdownData = structuredClone(pointerData);

                    setTimeout(() => {
                        if (!this.isGesture) {
                            if (this.lastPointerData) {
                                // update this.lastPointerData -> difference between this.lastPointerData and this.pointerdownData
                                this.lastPointerData.last = this.pointerdownData.current;
                                this.lastPointerData.delta = {
                                    x: this.lastPointerData.current.x - this.lastPointerData.last.x,
                                    y: this.lastPointerData.current.y - this.lastPointerData.last.y
                                };

                                this.toolManager.onInputPointer(this.pointerdownData);
                                this.toolManager.onInputPointer(this.lastPointerData);
                            } else {
                                this.toolManager.onInputPointer(this.pointerdownData);
                            }

                            this.pointerdownData = null;
                            this.lastPointerData = null;
                        } 

                        this.maybeDraw = false;
                    }, 20);

                    return;
                }

                if (this.maybeDraw) {
                    this.lastPointerData = structuredClone(pointerData);
                    return;
                }
            }

            this.toolManager.onInputPointer(pointerData);
        }
    }

    drawCursor(current) {
        if (this.isGesture) return;
        this.toolManager.drawCursor(current);
    }
}