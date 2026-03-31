export default class Canvas {
    constructor(checkerboard, canvas, cursorCanvas) {
        this.checkerboard = checkerboard;
        this.canvas = canvas;
        this.cursorCanvas = cursorCanvas;

        this.width = 256;
        this.height = 256;

        this.currentZoom = 1;

        this.resize();
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
        this.width = width;
        this.height = height;

        this.resize();
    }

    resize() {
        this.checkerboard.width = this.width;
        this.checkerboard.height = this.height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cursorCanvas.width = this.width;
        this.cursorCanvas.height = this.height;

        this.drawCheckerboard();
    }

    zoom(zoomValue) {
        this.currentZoom *= zoomValue;

        const width = this.width * this.currentZoom;
        const height = this.height * this.currentZoom;

        this.checkerboard.style.width = width + 'px';
        this.checkerboard.style.height = height + 'px';

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        this.cursorCanvas.style.width = width + 'px';
        this.cursorCanvas.style.height = height + 'px';
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