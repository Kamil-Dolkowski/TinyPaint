export default class Canvas {
    constructor(workspace, checkerboard, canvas, cursorCanvas, drawingStatus) {
        this.workspace = workspace;

        // this.checkerboard = this.workspace.querySelector("#checkerboard");
        // this.canvas = this.workspace.querySelector("#canvas");
        // this.cursorCanvas = this.workspace.querySelector("#cursor-canvas");

        this.checkerboard = checkerboard;
        this.canvas = canvas;
        this.cursorCanvas = cursorCanvas;

        this.drawingStatus = drawingStatus;

        this.width = 800;
        this.height = 600;

        this.cssWidth = this.width;
        this.cssHeight = this.height;

        this.currentZoom = 1;

        this.resize();
        this.autoZoom();
    }

    drawCheckerboard() {
        const tileSize = 16;
        const ctx = this.checkerboard.getContext("2d");

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

    setSize(width, height) {
        // 1. change physical size
        this.width = width;
        this.height = height;

        this.resize();

        // 2. change visual size
        // reset zoom
        this.currentZoom = 1;
        this.cssWidth = this.width * this.currentZoom;
        this.cssHeight = this.height * this.currentZoom;

        this.autoZoom();
    }

    resize() {
        this.checkerboard.width = this.width;
        this.checkerboard.height = this.height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cursorCanvas.width = this.width;
        this.cursorCanvas.height = this.height;

        this.drawCheckerboard();

        this.drawingStatus.canvasWidth = this.width;
        this.drawingStatus.canvasHeight = this.height;
    }

    zoom(zoomValue) {
        this.currentZoom *= zoomValue;

        this.cssWidth = this.width * this.currentZoom;
        this.cssHeight = this.height * this.currentZoom;

        this.checkerboard.style.width = this.cssWidth + 'px';
        this.checkerboard.style.height = this.cssHeight + 'px';

        this.canvas.style.width = this.cssWidth + 'px';
        this.canvas.style.height = this.cssHeight + 'px';

        this.cursorCanvas.style.width = this.cssWidth + 'px';
        this.cursorCanvas.style.height = this.cssHeight + 'px';
    }

    autoZoom() {
        const margin = 50;

        const workspaceWidth = this.workspace.offsetWidth;
        const workspaceHeight = this.workspace.offsetHeight;

        const zoomValue = Math.min(workspaceWidth / (this.cssWidth + margin), workspaceHeight / (this.cssHeight + margin));

        this.zoom(zoomValue);
    }

    move(x, y) {
        const rect = this.checkerboard.getBoundingClientRect();

        this.checkerboard.style.left = rect.left + x + 'px';
        this.checkerboard.style.top = rect.top + y + 'px';

        this.canvas.style.left = rect.left + x + 'px';
        this.canvas.style.top = rect.top + y + 'px';

        this.cursorCanvas.style.left = rect.left + x + 'px';
        this.cursorCanvas.style.top = rect.top + y + 'px';
    }
}