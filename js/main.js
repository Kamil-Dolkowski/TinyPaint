import drawingStatus from './DrawingStatus.js';

import Tool from './tools/Tool.js';
import Pencil from './tools/Pencil.js';
import Brush from './tools/Brush.js';
import Line from './tools/Line.js';
import Eraser from './tools/Eraser.js';
import MoveZoom from './tools/MoveZoom.js';

import Canvas from './Canvas.js';
import History from './History.js';
import Palette from './Palette.js';

// ===================== CANVAS =====================
const workspace = document.getElementById("workspace");

const checkerboard = document.getElementById("checkerboard");

const canvas1 = document.getElementById("canvas");
const ctx = canvas1.getContext("2d", { willReadFrequently: true });

const cursorCanvas = document.getElementById("cursor-canvas");
const cursorCtx = cursorCanvas.getContext("2d");

const canvas = new Canvas(workspace, checkerboard, canvas1, cursorCanvas, drawingStatus);

// ======== TOOLS INICIALIZATION ========
const pencil = new Pencil(ctx, cursorCtx, drawingStatus);
const brush = new Brush(ctx, cursorCtx, drawingStatus);
const line = new Line(ctx, cursorCtx, drawingStatus);
const eraser = new Eraser(ctx, cursorCtx, drawingStatus);
const moveZoom = new MoveZoom(ctx, cursorCtx, drawingStatus, canvas);

let currentTool = pencil;
let tempTool = null;

// ======== DRAW INITIAL SETTINGS ========
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

cursorCanvas.style.touchAction = "none";

// ======== CANVAS EVENTS ========

// 1 - pointerdown
cursorCanvas.addEventListener("pointerdown", e => {
    if (e.button == 0) {
        const rect = cursorCanvas.getBoundingClientRect();

        drawingStatus.isDrawing = true;

        drawingStatus.lastX = (e.clientX - rect.left) / canvas.currentZoom;
        drawingStatus.lastY = (e.clientY - rect.top) / canvas.currentZoom;

        drawingStatus.currentX = drawingStatus.lastX
        drawingStatus.currentY = drawingStatus.lastY;

        currentTool?.pointerdown(e);
    }

    // scroll button -> switch on move-zoom
    if (e.button == 1) {
        const rect = cursorCanvas.getBoundingClientRect();

        drawingStatus.isDrawing = true;

        drawingStatus.lastX = (e.clientX - rect.left) / canvas.currentZoom;
        drawingStatus.lastY = (e.clientY - rect.top) / canvas.currentZoom;

        drawingStatus.currentX = drawingStatus.lastX
        drawingStatus.currentY = drawingStatus.lastY;

        tempTool = currentTool;
        currentTool = moveZoom;

        // Clear cursor canvas
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    }
});

// 2 - pointermove
window.addEventListener("pointermove", e => {
    const rect = cursorCanvas.getBoundingClientRect();

    drawingStatus.currentX = (e.clientX - rect.left) / canvas.currentZoom;
    drawingStatus.currentY = (e.clientY - rect.top) / canvas.currentZoom;

    currentTool?.drawCursor();

    if (!drawingStatus.isDrawing) return;

    currentTool?.pointermove(e);
});

// 3 - pointerup
window.addEventListener("pointerup", e => {
    stopDraw(e);
});

// 3 - pointerout
window.addEventListener("pointerout", e => {
    // stopDraw(e);
});

function stopDraw(e) {
    // scroll button -> switch off move-zoom
    if (e.button == 1) {
        currentTool = tempTool;
        tempTool = null;
    }

    // Clear cursor canvas
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (!drawingStatus.isDrawing) return;

    drawingStatus.isDrawing = false;

    const rect = cursorCanvas.getBoundingClientRect();

    drawingStatus.currentX = (e.clientX - rect.left) / canvas.currentZoom;
    drawingStatus.currentY = (e.clientY - rect.top) / canvas.currentZoom;

    currentTool?.pointerup(e);

    if (currentTool.tool != Tool.MOVE_ZOOM) {
        history.addCanvasToHistory();
    }
}

// 4 - tool animation
function drawToolAnimation() {
    if (drawingStatus.isDrawing) {
        currentTool?.drawAnimationFrame();
    }

    requestAnimationFrame(drawToolAnimation);
}

drawToolAnimation();

// ===================== UNDO/REDO =====================

const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

const history = new History(canvas1, ctx, undoBtn, redoBtn);

// ===================== TOOLS =====================

// ======== TOOLS RADIO ========
const toolBtns = document.querySelectorAll("#toolbox-tools button")

toolBtns.forEach(toolBtn => {
    toolBtn.addEventListener("click", e => {
        toolBtns.forEach(toolBtn => {
            toolBtn.dataset.state = "off";
        });

        toolBtn.dataset.state = "on";
    });
});

// ======== PENCIL ========
const pencilBtn = document.getElementById("pencil-btn");

pencilBtn.addEventListener("click", () => {
    currentTool = pencil;
    currentTool.setTool();
});

// ======== BRUSH ========
const brushBtn = document.getElementById("brush-btn");

brushBtn.addEventListener("click", () => {
    currentTool = brush;
    currentTool.setTool();
});

// ======== LINE ========
const lineBtn = document.getElementById("line-btn");

lineBtn.addEventListener("click", () => {
    currentTool = line;
    currentTool.setTool();
});

// ======== ERASER ========
const eraserBtn = document.getElementById("eraser-btn");

eraserBtn.addEventListener("click", () => {
    currentTool = eraser;
    currentTool.setTool();
});

// ======== BACKGROUND COLOR ========
// const bgColorBtn = document.getElementById("bgcolor-btn");

// bgColorBtn.addEventListener("click", () => {

// });

// ======== MOVE_ZOOM ========
const moveZoomBtn = document.getElementById("move-zoom-btn");

moveZoomBtn.addEventListener("click", () => {
    currentTool = moveZoom;
    currentTool.setTool();
});

// ======== CLEAR ========
const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.addCanvasToHistory();
});

// ======== RESET_ZOOM ========
const resetZoomBtn = document.getElementById("reset-zoom-btn");

resetZoomBtn.addEventListener("click", () => {
    canvas.fitToScreen();
});

// ======== PALETTE ========
const paletteBtn = document.getElementById("palette-btn");
const paletteDiv = document.getElementById("palette");

const palette = new Palette(paletteDiv, paletteBtn, canvas);

paletteBtn.addEventListener("click", () => {
    palette.isPaletteVisible = !palette.isPaletteVisible;
    palette.updatePosition();

    if (palette.isPaletteVisible) {
        palette.show();
    } else {
        palette.hide();
    }
    
});

// ======== INCREASE/DECREASE DRAW SIZE ========

// -- BUTTONS --
const increaseBtn = document.getElementById("increase-btn");
const decreaseBtn = document.getElementById("decrease-btn");
const sizeLbl = document.getElementById("size-lbl");

sizeLbl.innerText = ctx.lineWidth;

increaseBtn.addEventListener("click", () => {
    if (currentTool.tool == Tool.PENCIL) return;

    ctx.lineWidth += 1;
    drawingStatus.drawSize = ctx.lineWidth;
    sizeLbl.innerText = ctx.lineWidth;
});

decreaseBtn.addEventListener("click", () => {
    if (currentTool.tool == Tool.PENCIL) return;

    ctx.lineWidth -= 1;
    drawingStatus.drawSize = ctx.lineWidth;
    sizeLbl.innerText = ctx.lineWidth;
});

// ======== COLOR PICKER ========
const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", () => {
    ctx.strokeStyle = colorPicker.value;
    ctx.fillStyle = colorPicker.value;
});

// ======== DOWNLOAD ========
const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", () => {
    const canvasUrl = canvas.toDataURL("image/png", 0.5);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "new_picture";
    createEl.click();
    createEl.remove();
});

// ======== UPLOAD ========
const uploadBtn = document.getElementById("upload-btn");

uploadBtn.addEventListener("click", () => {
    upload.click();
});

const upload = document.getElementById("upload");

upload.onchange = function(e) {
    img.onload = load_image;
    img.src = URL.createObjectURL(this.files[0]);
};

function load_image() {
    resizeCanvas();
        
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    history.addCanvasToHistory();
}

// ======== EXIT ALERT ========
window.addEventListener("beforeunload", e => {
    e.preventDefault();
    e.returnValue = '';
});

// ======== SHORTCUT KEYS ========
function shortcutKeysHandler(e) {
    // UNDO
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault(); 
        history.undo();
        return;
    }

    // REDO
    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault(); 
        history.redo();
        return;
    }

    // Move Zoom
    if (e.ctrlKey) {
        tempTool = currentTool;
        currentTool = moveZoom;

        // Clear cursor canvas
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    }
}

function keyup(e) {
    if (e.key == 'Control') {
        currentTool = tempTool;
        tempTool = null;
    }
}

function scrollHandler(e) {
    // Move Zoom
    if (currentTool.tool == Tool.MOVE_ZOOM) {
        e.preventDefault();

        if (e.deltaY > 0) {
            currentTool.zoomOut(e);
        } else {
            currentTool.zoomIn(e);
        }

        return;
    }

    // Other Tools
    if (currentTool.tool == Tool.PENCIL) return;
    
    if (e.deltaY > 0) {
        ctx.lineWidth -= 1;
        sizeLbl.innerText = ctx.lineWidth;
    } else {
        ctx.lineWidth += 1;
        sizeLbl.innerText = ctx.lineWidth;
    }

    drawingStatus.drawSize = ctx.lineWidth;
    currentTool?.drawCursor();
}

window.addEventListener('keydown', shortcutKeysHandler);
window.addEventListener('keyup', keyup);
window.addEventListener('wheel', scrollHandler, { passive: false });