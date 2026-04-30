import drawingStatus from './DrawingStatus.js';

import Tool from './tools/Tool.js';
import Pencil from './tools/Pencil.js';
import Brush from './tools/Brush.js';
import Line from './tools/Line.js';
import Eraser from './tools/Eraser.js';
import MoveZoom from './tools/MoveZoom.js';
import Eyedropper from './tools/Eyedropper.js';

import Canvas from './Canvas.js';
import History from './History.js';
import Gesture from './Gesture.js';
import Palette from './colors//Palette.js';
import ImageExport from './io/ImageExport.js';
import ImageImport from './io/ImageImport.js';

// ===================== CANVAS =====================
const workspace = document.getElementById("workspace");

const checkerboard = document.getElementById("checkerboard");

const canvas1 = document.getElementById("canvas");
const ctx = canvas1.getContext("2d", { willReadFrequently: true });

const cursorCanvas = document.getElementById("cursor-canvas");
const cursorCtx = cursorCanvas.getContext("2d");

const canvas = new Canvas(workspace, checkerboard, canvas1, cursorCanvas, drawingStatus);

initSettingsModal(canvas);

// ======== TOOLS INICIALIZATION ========
const pencil = new Pencil(ctx, cursorCtx, drawingStatus);
const brush = new Brush(ctx, cursorCtx, drawingStatus);
const line = new Line(ctx, cursorCtx, drawingStatus);
const eraser = new Eraser(ctx, cursorCtx, drawingStatus);
const moveZoom = new MoveZoom(ctx, cursorCtx, drawingStatus, canvas);

drawingStatus.currentTool = pencil;
let tempTool = null;

// ======== DRAW INITIAL SETTINGS ========
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

cursorCanvas.style.touchAction = "none";

// ======== CANVAS EVENTS ========

const gesture = new Gesture(moveZoom, canvas, drawingStatus);

// 1 - pointerdown
cursorCanvas.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch") {
        gesture.addPointer(e);
    }

    if (e.button == 0) {
        const rect = cursorCanvas.getBoundingClientRect();

        drawingStatus.isDrawing = true;

        drawingStatus.lastX = (e.clientX - rect.left) / canvas.currentZoom;
        drawingStatus.lastY = (e.clientY - rect.top) / canvas.currentZoom;

        drawingStatus.currentX = drawingStatus.lastX
        drawingStatus.currentY = drawingStatus.lastY;

        drawingStatus.currentTool?.pointerdown(e);
    }

    // scroll button -> switch on move-zoom
    if (e.button == 1) {
        const rect = cursorCanvas.getBoundingClientRect();

        drawingStatus.isDrawing = true;

        drawingStatus.lastX = (e.clientX - rect.left) / canvas.currentZoom;
        drawingStatus.lastY = (e.clientY - rect.top) / canvas.currentZoom;

        drawingStatus.currentX = drawingStatus.lastX
        drawingStatus.currentY = drawingStatus.lastY;

        tempTool = drawingStatus.currentTool;
        drawingStatus.currentTool = moveZoom;

        // Clear cursor canvas
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    }

    cursorCanvas.setPointerCapture(e.pointerId);
});

// 2 - pointermove
cursorCanvas.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") {
        gesture.pointermove(e);
    }

    const rect = cursorCanvas.getBoundingClientRect();

    drawingStatus.currentX = (e.clientX - rect.left) / canvas.currentZoom;
    drawingStatus.currentY = (e.clientY - rect.top) / canvas.currentZoom;

    drawingStatus.currentTool?.drawCursor();

    if (!drawingStatus.isDrawing) return;

    drawingStatus.currentTool?.pointermove(e);
});

// 3 - pointerup
cursorCanvas.addEventListener("pointerup", e => {
    stopDraw(e);
});

// 3 - pointerout
cursorCanvas.addEventListener("pointerout", e => {
    // stopDraw(e);
});

function stopDraw(e) {
    cursorCanvas.releasePointerCapture(e.pointerId);
    
    gesture.deletePointer(e);

    // scroll button -> switch off move-zoom
    if (e.button == 1) {
        drawingStatus.currentTool = tempTool;
        tempTool = null;
    }

    // Clear cursor canvas
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (!drawingStatus.isDrawing) return;

    drawingStatus.isDrawing = false;

    const rect = cursorCanvas.getBoundingClientRect();

    drawingStatus.currentX = (e.clientX - rect.left) / canvas.currentZoom;
    drawingStatus.currentY = (e.clientY - rect.top) / canvas.currentZoom;

    drawingStatus.currentTool?.pointerup(e);

    if (drawingStatus.currentTool.tool != Tool.MOVE_ZOOM) {
        history.addCanvasToHistory();
    }
}

// 4 - tool animation
function drawToolAnimation() {
    if (drawingStatus.isDrawing) {
        drawingStatus.currentTool?.drawAnimationFrame();
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
    drawingStatus.currentTool = pencil;
    drawingStatus.currentTool.setTool();
});

// ======== BRUSH ========
const brushBtn = document.getElementById("brush-btn");

brushBtn.addEventListener("click", () => {
    drawingStatus.currentTool = brush;
    drawingStatus.currentTool.setTool();
});

// ======== LINE ========
const lineBtn = document.getElementById("line-btn");

lineBtn.addEventListener("click", () => {
    drawingStatus.currentTool = line;
    drawingStatus.currentTool.setTool();
});

// ======== ERASER ========
const eraserBtn = document.getElementById("eraser-btn");

eraserBtn.addEventListener("click", () => {
    drawingStatus.currentTool = eraser;
    drawingStatus.currentTool.setTool();
});

// ======== BACKGROUND COLOR ========
// const bgColorBtn = document.getElementById("bgcolor-btn");

// bgColorBtn.addEventListener("click", () => {

// });

// ======== MOVE_ZOOM ========
const moveZoomBtn = document.getElementById("move-zoom-btn");

moveZoomBtn.addEventListener("click", () => {
    drawingStatus.currentTool = moveZoom;
    drawingStatus.currentTool.setTool();
});

// ======== EYEDROPPER ========
const eyedropperBtn = document.getElementById("eyedropper-btn");

eyedropperBtn.addEventListener("click", () => {
    drawingStatus.currentTool = eyedropper;
    drawingStatus.currentTool.setTool();
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
const paletteWindow = document.getElementById("palette-window");
const currentColor = document.getElementById("current-color");

const palette = new Palette(paletteWindow, paletteBtn, currentColor, canvas);

const eyedropper = new Eyedropper(ctx, cursorCtx, drawingStatus, palette);

// ======== INCREASE/DECREASE DRAW SIZE ========

// -- BUTTONS --
const increaseBtn = document.getElementById("increase-btn");
const decreaseBtn = document.getElementById("decrease-btn");
const sizeLbl = document.getElementById("size-lbl");

sizeLbl.innerText = ctx.lineWidth;

increaseBtn.addEventListener("click", () => {
    if (drawingStatus.currentTool.tool == Tool.PENCIL) return;

    ctx.lineWidth += 1;
    drawingStatus.drawSize = ctx.lineWidth;
    sizeLbl.innerText = ctx.lineWidth;
});

decreaseBtn.addEventListener("click", () => {
    if (drawingStatus.currentTool.tool == Tool.PENCIL) return;

    ctx.lineWidth -= 1;
    drawingStatus.drawSize = ctx.lineWidth;
    sizeLbl.innerText = ctx.lineWidth;
});

// ======== DOWNLOAD ========
const exportBtn = document.getElementById("export-btn");

const imageExport = new ImageExport(exportBtn, canvas.canvas);

// ======== UPLOAD ========
const importBtn = document.getElementById("import-btn");

const imageImport = new ImageImport(importBtn, canvas, history);

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
        tempTool = drawingStatus.currentTool;
        drawingStatus.currentTool = moveZoom;

        // Clear cursor canvas
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    }
}

function keyup(e) {
    if (e.key == 'Control') {
        drawingStatus.currentTool = tempTool;
        tempTool = null;
    }
}

function scrollHandler(e) {
    // Move Zoom
    if (drawingStatus.currentTool.tool == Tool.MOVE_ZOOM) {
        e.preventDefault();

        const zoomPoint = {x: e.clientX, y: e.clientY};

        if (e.deltaY > 0) {
            drawingStatus.currentTool.zoomOut(zoomPoint);
        } else {
            drawingStatus.currentTool.zoomIn(zoomPoint);
        }

        return;
    }

    // Other Tools
    if (drawingStatus.currentTool.tool == Tool.PENCIL) return;
    
    if (e.deltaY > 0) {
        ctx.lineWidth -= 1;
        sizeLbl.innerText = ctx.lineWidth;
    } else {
        ctx.lineWidth += 1;
        sizeLbl.innerText = ctx.lineWidth;
    }

    drawingStatus.drawSize = ctx.lineWidth;
    drawingStatus.currentTool?.drawCursor();
}

window.addEventListener('keydown', shortcutKeysHandler);
window.addEventListener('keyup', keyup);
window.addEventListener('wheel', scrollHandler, { passive: false });