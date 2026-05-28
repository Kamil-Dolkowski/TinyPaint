export default class App {
    constructor(drawingState, canvas, palette) {
        this.drawingState = drawingState;

        this.canvas = canvas;
        this.palette = palette;

        // events
        this.canvas.addEventListener("afterResize", () => {
            this.canvas.applyState(this.drawingState);
        });

        this.palette.addEventListener("change", e => {
            if (this.drawingState.currentColor == e.detail.color) return;

            this.drawingState.currentColor = e.detail.color;
            this.canvas.applyState(this.drawingState);
        });
    }

    
}