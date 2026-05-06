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
        //     current: {
        //         x: [float], 
        //         y: [float]
        //     },
        //     last: {
        //         x: [float],
        //         y: [float]
        //     },
        //     delta: {
        //         x: [float],
        //         y: [float]
        //     },
        //     client: {
        //         x: [float],
        //         y: [float]
        //     }
        // }
    }
    
    // ========= POINTER EVENTS =========

    pointerdown(e) {
        const rect = this.canvas.canvas.getBoundingClientRect();

        const current = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };

        const last = {
            x: current.x,
            y: current.y
        }

        const delta = {
            x: 0, 
            y: 0
        };

        const pointerData = {
            pointerId: e.pointerId,
            eventType: "pointerdown",
            pointerType: e.pointerType,
            button: e.button,
            current: current,
            last: last,
            delta: delta,
            client: {x: e.clientX, y: e.clientY}
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

        const last = pointerData.current;
        const current = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };

        pointerData.last = last;
        pointerData.current = current;

        pointerData.delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData.client = {x: e.clientX, y: e.clientY};

        const gestureData = this.gestureManager.update([...this.activePointers.values()]);
        this.interactionController.onInput(pointerData, gestureData);
    }
    
    pointerup(e) {
        let pointerData = this.activePointers.get(e.pointerId);

        const rect = this.canvas.canvas.getBoundingClientRect();

        const current = {
            x: (e.clientX - rect.left) / this.canvas.currentZoom, 
            y: (e.clientY - rect.top) / this.canvas.currentZoom
        };

        const last = pointerData.current;

        const delta = {
            x: current.x - last.x, 
            y: current.y - last.y
        };

        pointerData = {
            pointerId: e.pointerId,
            eventType: "pointerup",
            pointerType: e.pointerType,
            button: e.button,
            current: current,
            last: last,
            delta: delta,
            client: {x: e.clientX, y: e.clientY}
        }

        this.activePointers.delete(e.pointerId);

        const gestureData = this.gestureManager.update([...this.activePointers.values()]);
        this.interactionController.onInput(pointerData, gestureData);
    }
}