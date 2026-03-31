export default class History {
    constructor(canvas, ctx, undoBtn, redoBtn) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.undoBtn = undoBtn;
        this.redoBtn = redoBtn;

        this.undoStack = [this.canvas.toDataURL()];
        this.redoStack = [];

        this.limit = 30;

        this.img = new Image();

        // Add Event Listeners
        this.undoBtn.addEventListener("click", () => this.undo());
        this.redoBtn.addEventListener("click", () => this.redo());
    }

    addCanvasToHistory() {
        this.undoStack.push(this.canvas.toDataURL());
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
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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