export default class Canvas {
    constructor(workspace, canvasSpace, canvasBorder, checkerboard, canvas, cursorCanvas) {
        // elements
        this.workspace = workspace;
        this.canvasSpace = canvasSpace;
        this.canvasBorder = canvasBorder;

        // canvases
        this.checkerboard = checkerboard;
        this.canvas = canvas;
        this.cursorCanvas = cursorCanvas;

        // ctx'es
        this.checkerboardCtx = this.checkerboard.getContext("2d");
        this.ctx = this.canvas.getContext("2d");
        this.cursorCtx = this.cursorCanvas.getContext("2d");

        // sizes
        this.width = 800;
        this.height = 600;

        this.cssWidth = this.width;
        this.cssHeight = this.height;

        // position
        this.x = 0;
        this.y = 0;

        // zoom values
        this.currentZoom = 1; // current canvas css scale
        this.fitZoom = 1; // fit-to-screen zoom
        this.maxZoom = 1000; // zoom in limit
        
        this.resize();
        this.fitToScreen();
    }

    drawCheckerboard() {
        const tileSize = 16;
        const ctx = this.checkerboardCtx;

        for (let y = 0; y*tileSize < this.height; y++) {
            for (let x = 0; x*tileSize < this.width; x++) {

                if ((x + y) % 2 == 0) {
                    ctx.fillStyle = "#aaa";
                } else {
                    ctx.fillStyle = "#555";
                }

                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
        }
    }

    upplyState(drawingState) {
        this.ctx.fillStyle = drawingState.currentColor;
        this.ctx.strokeStyle = drawingState.currentColor;
        this.ctx.lineWidth = drawingState.drawSize;
        this.ctx.globalAlpha = drawingState.alpha;
        this.ctx.font = drawingState.font;
    }

    setSize(width, height) {
        // 1. change physical size
        this.width = width;
        this.height = height;

        this.resize();

        // 2. change visual size
        // reset zoom
        this.currentZoom = 1;

        this.fitToScreen();
    }

    resize() {
        // elements
        this.canvasSpace.style.width = this.width + "px";
        this.canvasSpace.style.height = this.height + "px";

        this.canvasBorder.style.width = this.width + "px";
        this.canvasBorder.style.height = this.height + "px";

        // canvases
        this.checkerboard.width = this.width;
        this.checkerboard.height = this.height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cursorCanvas.width = this.width;
        this.cursorCanvas.height = this.height;

        this.drawCheckerboard();
    }

    setZoom(value) {
        // check if zoom limit
        if (value > this.maxZoom || value < this.fitZoom / 3) return false;

        // update currentZoom
        this.currentZoom = value;

        // update canvases css size 
        this.cssWidth = this.width * this.currentZoom;
        this.cssHeight = this.height * this.currentZoom;

        this.updateTransform();

        return true;
    }

    zoomBy(factor, baseZoom = this.currentZoom) {
        if (baseZoom === null) baseZoom = this.currentZoom;
        return this.setZoom(baseZoom * factor);
    }

    fitToScreen() {
        const margin = 50;

        const workspaceWidth = this.workspace.offsetWidth;
        const workspaceHeight = this.workspace.offsetHeight;

        // zoom
        const newCssWidth = workspaceWidth - 2*margin;
        const newCssHeight = workspaceHeight - 2*margin;

        this.fitZoom = Math.min(newCssWidth / this.width, newCssHeight / this.height);
        
        this.setZoom(this.fitZoom);

        // move
        const x = (workspaceWidth - this.cssWidth) / 2;
        const y = (workspaceHeight - this.cssHeight) / 2;

        this.moveAbsolute(x, y);
    }

    moveRelative(x, y) {
        this.x += x;
        this.y += y;

        this.updateTransform();
    }

    moveAbsolute(x, y) {
        this.x = x;
        this.y = y;

        this.updateTransform();
    }

    updateTransform() {
        // update canvas space transform -> update all canvases transforms
        this.canvasSpace.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.currentZoom})`;

        // update canvasBorder size and translate
        this.canvasBorder.style.width = this.cssWidth + "px";
        this.canvasBorder.style.height = this.cssHeight + "px";

        this.canvasBorder.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    clearCursorCanvas() {
        this.cursorCtx.clearRect(0, 0, this.width, this.height);
    }

    clearMainCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}