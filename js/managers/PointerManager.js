export default class PointerManager {
    constructor(canvas, interactionController, gestureManager) {
        this.canvas = canvas;
        this.interactionController = interactionController;
        this.gestureManager = gestureManager;

        this.activePointers = new Map(); // e.pointerId: pointerData

        // pointerData = {
        //     pointerId: [int],
        //     eventType: [string] ("pointerdown"/"pointermove"/...),
        //     pointerType: [string] ("mouse"/"touch"/"pen"),
        //     button: [int] (e.button),
        //     shiftKey: e.shiftKey,
        //     canvas: {
        //         current: {
        //             x: [float], 
        //             y: [float]
        //         },
        //         last: {
        //             x: [float],
        //             y: [float]
        //         },
        //         delta: {
        //             x: [float],
        //             y: [float]
        //         }
        //     },
        //     client: {
        //         current: {
        //             x: [float], 
        //             y: [float]
        //         },
        //         last: {
        //             x: [float],
        //             y: [float]
        //         },
        //         delta: {
        //             x: [float],
        //             y: [float]
        //         }
        //     }
        // }
    }

    getPointerCount() {
        return this.activePointers.size;
    }

    clientToCanvasCoords(client) {
        const rect = this.canvas.canvas.getBoundingClientRect();

        const result = {
            x: (client.x - rect.left) / this.canvas.currentZoom, 
            y: (client.y - rect.top) / this.canvas.currentZoom
        };

        return result;
    }

    // ========= POINTER EVENTS =========

    pointerdown(e) {
        const rect = this.canvas.canvas.getBoundingClientRect();

        const canvasCurrent = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };

        const pointerData = {
            pointerId: e.pointerId,
            eventType: "pointerdown",
            pointerType: e.pointerType,
            button: e.button,
            shiftKey: e.shiftKey,
            canvas: {
                current: {
                    x: canvasCurrent.x, 
                    y: canvasCurrent.y
                },
                last: {
                    x: canvasCurrent.x,
                    y: canvasCurrent.y
                },
                delta: {
                    x: 0, 
                    y: 0
                }
            },
            client: {
                current: {
                    x: e.clientX, 
                    y: e.clientY
                },
                last: {
                    x: e.clientX,
                    y: e.clientY
                },
                delta: {
                    x: 0, 
                    y: 0
                }
            }
        }

        this.activePointers.set(e.pointerId, pointerData);

        const gestureData = this.gestureManager.update([...this.activePointers.values()]);
        this.interactionController.onInput(pointerData, gestureData);
    }

    pointermove(e) {
        let pointerData = this.activePointers.get(e.pointerId);

        if (!pointerData) return;

        const rect = this.canvas.canvas.getBoundingClientRect();
        
        pointerData.eventType = "pointermove";
        pointerData.shiftKey = e.shiftKey;

        // canvas
        let last = pointerData.canvas.current;
        let current = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };
        
        let delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData.canvas.last = last;
        pointerData.canvas.current = current;
        pointerData.canvas.delta = delta;

        // client
        last = pointerData.client.current;
        current = {
            x: e.clientX,
            y: e.clientY
        };
        
        delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData.client.last = last;
        pointerData.client.current = current;
        pointerData.client.delta = delta;

        const gestureData = this.gestureManager.update([...this.activePointers.values()]);
        this.interactionController.onInput(pointerData, gestureData);
    }
    
    pointerup(e) {
        let pointerData = structuredClone(this.activePointers.get(e.pointerId));

        const rect = this.canvas.canvas.getBoundingClientRect();

        pointerData.eventType = "pointerup";
        pointerData.shiftKey = e.shiftKey;

        // canvas
        let last = pointerData.canvas.current;
        let current = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };
        
        let delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData.canvas.last = last;
        pointerData.canvas.current = current;
        pointerData.canvas.delta = delta;

        // client
        last = pointerData.client.current;
        current = {
            x: e.clientX,
            y: e.clientY
        };
        
        delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData.client.last = last;
        pointerData.client.current = current;
        pointerData.client.delta = delta;

        this.activePointers.delete(e.pointerId);

        const gestureData = this.gestureManager.update([...this.activePointers.values()]);
        this.interactionController.onInput(pointerData, gestureData);
    }
}