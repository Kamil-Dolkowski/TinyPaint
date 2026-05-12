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
                                // canvas
                                this.lastPointerData.canvas.last = this.pointerdownData.canvas.current;
                                this.lastPointerData.canvas.delta = {
                                    x: this.lastPointerData.canvas.current.x - this.lastPointerData.canvas.last.x,
                                    y: this.lastPointerData.canvas.current.y - this.lastPointerData.canvas.last.y
                                };

                                // client
                                this.lastPointerData.client.last = this.pointerdownData.client.current;
                                this.lastPointerData.client.delta = {
                                    x: this.lastPointerData.client.current.x - this.lastPointerData.client.last.x,
                                    y: this.lastPointerData.client.current.y - this.lastPointerData.client.last.y
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