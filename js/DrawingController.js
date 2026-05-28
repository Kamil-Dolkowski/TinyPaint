export default class DrawingController {
    constructor(drawingState, canvas, palette, toolManager, controlsContent) {
        this.drawingState = drawingState;

        this.canvas = canvas;
        this.palette = palette;
        this.toolManager = toolManager;
        this.controlsContent = controlsContent;

        // init default state
        this.canvas.applyState(this.drawingState);

        // events
        this.canvas.addEventListener("afterResize", () => {
            this.canvas.applyState(this.drawingState);
        });

        this.palette.addEventListener("change", e => {
            if (this.drawingState.currentColor == e.detail.color) return;

            this.drawingState.currentColor = e.detail.color;
            this.canvas.applyState(this.drawingState);
        });

        this.toolManager.addEventListener("change", e => {
            Object.entries(e.detail.settings).forEach(([key, value]) => {
                this.drawingState[key] = value;
            });

            this.canvas.applyState(this.drawingState);
        });

        this.controlsContent.size.addEventListener("change", e => {
            if (this.drawingState.drawSize == e.detail.value) return;

            this.drawingState.drawSize = e.detail.value;
            this.canvas.applyState(this.drawingState);
        });

        this.controlsContent.alpha.addEventListener("change", e => {
            if (this.drawingState.drawSize == e.detail.value) return;

            this.drawingState.alpha = Number(e.detail.value)/100;
            this.canvas.applyState(this.drawingState);
        });
    }

    
}