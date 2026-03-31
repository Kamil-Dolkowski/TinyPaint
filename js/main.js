import drawingStatus from './DrawingStatus.js';

import Tool from './tools/Tool.js';
import Pencil from './tools/Pencil.js';
import Brush from './tools/Brush.js';
import Line from './tools/Line.js';
import Eraser from './tools/Eraser.js';

import History from './History.js'

// ===================== CANVAS =====================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cursorCanvas = document.getElementById("cursor-canvas");
const cursorCtx = cursorCanvas.getContext("2d");

function resizeCanvas() {
    const lineWidth = ctx.lineWidth;
    const strokeStyle = ctx.strokeStyle;
    const lineCap = ctx.lineCap;
    const lineJoin = ctx.lineJoin;
    // const globalCompositeOperation = ctx.globalCompositeOperation;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawingStatus.canvasWidth = canvas.width;
    drawingStatus.canvasHeight = canvas.height;

    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    // ctx.globalCompositeOperation = globalCompositeOperation;
}

resizeCanvas();

// window.addEventListener("resize", renderImage);

// ======== TOOLS INICIALIZATION ========
const pencil = new Pencil(ctx, cursorCtx, drawingStatus);
const brush = new Brush(ctx, cursorCtx, drawingStatus);
const line = new Line(ctx, cursorCtx, drawingStatus);
const eraser = new Eraser(ctx, cursorCtx, drawingStatus);

let currentTool = pencil;

// ======== DRAW INITIAL SETTINGS ========
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

canvas.style.touchAction = "none";

// ======== CANVAS EVENTS ========

// 1 - pointerdown
canvas.addEventListener("pointerdown", e => {
    if (e.button == 0) {
        drawingStatus.isDrawing = true;

        drawingStatus.lastX = e.offsetX;
        drawingStatus.lastY = e.offsetY;

        drawingStatus.currentX = e.offsetX;
        drawingStatus.currentY = e.offsetY;

        currentTool?.pointerdown(e);
    }
});

// 2 - pointermove
canvas.addEventListener("pointermove", e => {
    drawingStatus.currentX = e.offsetX;
    drawingStatus.currentY = e.offsetY;

    currentTool?.drawCursor();

    if (!drawingStatus.isDrawing) return;

    currentTool?.pointermove(e);
});

// 3 - pointerup
canvas.addEventListener("pointerup", e => {
    stopDraw(e);
});

// 3 - pointerout
canvas.addEventListener("pointerout", e => {
    stopDraw(e);
});

function stopDraw(e) {
    // Clear cursor canvas
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    if (!drawingStatus.isDrawing) return;

    drawingStatus.isDrawing = false;

    drawingStatus.currentX = e.offsetX;
    drawingStatus.currentY = e.offsetY;

    currentTool?.pointerup(e);

    history.addCanvasToHistory();
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

const history = new History(canvas, ctx, undoBtn, redoBtn);

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

// ======== CLEAR ========
const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.addCanvasToHistory();
});

// ======== INCREASE/DECREASE BRUSH SIZE ========

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

// -- MOUSE SCROLL --
window.addEventListener("wheel", e => {
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
});

// ======== COLOR PICKER ========
const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", () => {
    ctx.strokeStyle = colorPicker.value;
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
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault(); 
        undo();
    }
    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault(); 
        redo();
    }
}

window.addEventListener('keydown', shortcutKeysHandler);