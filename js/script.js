import drawingStatus from './DrawingStatus.js';

import Tool from './tools/Tool.js';
import Pencil from './tools/Pencil.js';
import Brush from './tools/Brush.js';
import Line from './tools/Line.js';
import Eraser from './tools/Eraser.js';

// ======== CANVAS ========
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let cursorCanvas = document.getElementById("cursor-canvas");
let cursorCtx = cursorCanvas.getContext("2d");

function resizeCanvas() {
    const lineWidth = ctx.lineWidth;
    const strokeStyle = ctx.strokeStyle;
    const lineCap = ctx.lineCap;
    const lineJoin = ctx.lineJoin;
    // const globalCompositeOperation = ctx.globalCompositeOperation;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    // ctx.globalCompositeOperation = globalCompositeOperation;
}

resizeCanvas();

window.addEventListener("resize", renderImage);

// Cursor

let mouseX = null;
let mouseY = null;

canvas.addEventListener("pointermove", e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    drawCursor();
});

function drawCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    cursorCtx.save();
    cursorCtx.lineWidth = 1;
    cursorCtx.strokeStyle = "black"
    cursorCtx.restore();

    cursorCtx.beginPath();
    cursorCtx.arc(mouseX, mouseY, ctx.lineWidth / 2, 0, 2 * Math.PI);
    cursorCtx.stroke();
}

canvas.addEventListener("pointerout", e => {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
});


// ======== TOOLS INICIALIZATION ========
let pencil = new Pencil(ctx, cursorCtx, drawingStatus);
let brush = new Brush(ctx, cursorCtx, drawingStatus);
let line = new Line(ctx, cursorCtx, drawingStatus);
let eraser = new Eraser(ctx, cursorCtx, drawingStatus);

let currentTool = pencil;

// ======== DRAWING ========
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

canvas.style.touchAction = "none";

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

canvas.addEventListener("pointermove", e => {
    if (!drawingStatus.isDrawing) return;

    drawingStatus.currentX = e.offsetX;
    drawingStatus.currentY = e.offsetY;

    currentTool?.pointermove(e);
});

canvas.addEventListener("pointerup", e => {
    stopDraw(e);
});

canvas.addEventListener("pointerout", e => {
    stopDraw(e);
});

function stopDraw(e) {
    if (!drawingStatus.isDrawing) return;

    drawingStatus.isDrawing = false;

    drawingStatus.currentX = e.offsetX;
    drawingStatus.currentY = e.offsetY;

    currentTool?.pointerup(e);

    addCanvasToHistory();
}

function drawToolAnimation() {
    if (drawingStatus.isDrawing) {
        currentTool?.drawAnimationFrame();
    }

    requestAnimationFrame(drawToolAnimation);
}

drawToolAnimation();

// ======== UNDO/REDO ========

const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

// Drawing History
let undoStack = [canvas.toDataURL()];
let redoStack = [];

let img = new Image;

function addCanvasToHistory() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];

    if (undoStack.length > 30) {
        undoStack.shift();
    }

    undoBtn.disabled = false;
    redoBtn.disabled = true;
}

function undo() {
    if (undoStack.length > 1) {
        const currentSource = undoStack.pop();
        redoStack.push(currentSource);

        renderImage();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const currentSource = redoStack.pop();
        undoStack.push(currentSource);

        renderImage();
    }
}

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

function renderImage() {
    img.src = undoStack[undoStack.length - 1];

    img.onload = () => {
        resizeCanvas();
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
    }

    if (undoStack.length > 1) {
        undoBtn.disabled = false;
    } else {
        undoBtn.disabled = true;
    }

    if (redoStack.length > 0) {
        redoBtn.disabled = false;
    } else {
        redoBtn.disabled = true;
    }
}

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
    addCanvasToHistory();
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
    drawCursor();
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
    // canvas.width = this.width;
    // canvas.height = this.height;
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    addCanvasToHistory();
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