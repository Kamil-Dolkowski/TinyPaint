export default class App {
    constructor(drawingState, canvas, palette, controlsContent) {
        this.drawingState = drawingState;

        this.canvas = canvas;
        this.palette = palette;
        this.controlsContent = controlsContent;

        // events
        this.canvas.addEventListener("afterResize", () => {
            this.canvas.applyState(this.drawingState);
        });

        this.palette.addEventListener("change", e => {
            if (this.drawingState.currentColor == e.detail.color) return;

            this.drawingState.currentColor = e.detail.color;
            this.canvas.applyState(this.drawingState);
        });

        this.controlsContent.size.addEventListener("change", e => {
            if (this.drawingState.drawSize == e.detail.value) return;

            this.drawingState.drawSize = e.detail.value;
            this.canvas.applyState(this.drawingState);
        });

        this.controlsContent.alpha.addEventListener("change", e => {
            if (this.drawingState.drawSize == e.detail.value) return;

            this.drawingState.drawSize = e.detail.value;
            this.canvas.applyState(this.drawingState);
        });
    }

    
}