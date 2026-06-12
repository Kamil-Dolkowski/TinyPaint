export default class History {
    constructor(canvas, undoBtn, redoBtn) {
        this.canvas = canvas;
        this.mainCanvas = this.canvas.canvas;
        this.ctx = this.canvas.ctx;
        this.undoBtn = undoBtn;
        this.redoBtn = redoBtn;

        this.undoStack = [this.mainCanvas.toDataURL()];
        this.redoStack = [];

        this.limit = 30;

        this.img = new Image();

        // Add Event Listeners
        this.undoBtn.addEventListener("click", () => this.undo());
        this.redoBtn.addEventListener("click", () => this.redo());
    }

    addCanvasToHistory() {
        this.undoStack.push(this.mainCanvas.toDataURL());
        this.redoStack = [];

        if (this.undoStack.length > this.limit) {
            this.undoStack.shift();
        }

        this.undoBtn.disabled = false;
        this.redoBtn.disabled = true;
    }

    undo() {
        if (this.undoStack.length > 1) {
            const currentSource = this.undoStack.pop();
            this.redoStack.push(currentSource);

            this.renderImage();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const currentSource = this.redoStack.pop();
            this.undoStack.push(currentSource);

            this.renderImage();
        }
    }

    renderImage() {
        this.img.src = this.undoStack[this.undoStack.length - 1];

        this.img.onload = () => {
            this.ctx.save();
            this.ctx.globalCompositeOperation = "source-over";
            
            this.ctx.imageSmoothingEnabled = false;
            this.canvas.clearMainCanvas();
            this.ctx.drawImage(this.img, 0, 0);

            this.ctx.restore();
        }

        if (this.undoStack.length > 1) {
            this.undoBtn.disabled = false;
        } else {
            this.undoBtn.disabled = true;
        }

        if (this.redoStack.length > 0) {
            this.redoBtn.disabled = false;
        } else {
            this.redoBtn.disabled = true;
        }
    }
}