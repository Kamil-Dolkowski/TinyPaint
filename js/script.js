const Tool = Object.freeze({
    PENCIL: 'pencil',
    BRUSH: 'brush',
    ERASER: 'eraser',
    LINE: 'line',
    FILL: 'fill',
    MOVE: 'move',
    ZOOM: 'zoom',
    COLOR_PICKER: 'color_picker'
});

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

var mouseX = null;
var mouseY = null;

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

// ======== DRAWING ========
ctx.lineWidth = 5;
ctx.strokeStyle = "black";

canvas.style.touchAction = "none";

var tool = Tool.BRUSH;
var drawing = false;

var lastX = null;
var lastY = null;

var currentX = null;
var currentY = null;

canvas.addEventListener("pointerdown", e => {
    if (e.button == 0) {
        drawing = true;

        lastX = e.offsetX;
        lastY = e.offsetY;

        currentX = e.offsetX;
        currentY = e.offsetY;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }
});

canvas.addEventListener("pointermove", e => {
    if (!drawing) return;

    currentX = e.offsetX;
    currentY = e.offsetY;

    if (tool == Tool.PENCIL || tool == Tool.BRUSH || tool == Tool.ERASER) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY)
        ctx.stroke();

        lastX = currentX;
        lastY = currentY;
    }

    if (tool == Tool.LINE) {
        if (e.shiftKey) {
            ({x: currentX, y: currentY} = getPerpendicularLineCoords(lastX, lastY, currentX, currentY));
        }
    }
});

canvas.addEventListener("pointerup", e => {
    stopDraw(e);
});

canvas.addEventListener("pointerout", e => {
    stopDraw(e);
});

function stopDraw(e) {
    if (!drawing) return;

    drawing = false;

    currentX = e.offsetX;
    currentY = e.offsetY;
    
    if (tool == Tool.LINE) {
        if (e.shiftKey) {
            var {x: currentX, y: currentY} = getPerpendicularLineCoords(lastX, lastY, currentX, currentY);
        }

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY)
        ctx.stroke();
    }

    addCanvasToHistory();
}

function getPerpendicularLineCoords(originX, originY, currentX, currentY) {
    // 1. create 2 points by crossing coordinates
    // 2. select the closest point to the current point

    const current = {x: currentX, y: currentY};
    const point1 = {x: originX, y: currentY};
    const point2 = {x: currentX, y: originY};

    const distance1 = (point1.x - current.x) ** 2 + (point1.y - current.y) ** 2
    const distance2 = (point2.x - current.x) ** 2 + (point2.y - current.y) ** 2

    if (distance1 < distance2) {
        return {x: point1.x, y: point1.y};
    } else {
        return {x: point2.x, y: point2.y};
    }
}

function drawLineVisualization() {
    if (drawing && tool == Tool.LINE) {
        cursorCtx.save();

        cursorCtx.lineWidth = ctx.lineWidth;
        cursorCtx.lineCap = "round";
        cursorCtx.strokeStyle = ctx.strokeStyle;

        cursorCtx.beginPath();
        cursorCtx.moveTo(lastX, lastY);
        cursorCtx.lineTo(currentX, currentY)
        cursorCtx.stroke();

        cursorCtx.restore();
    }

    requestAnimationFrame(drawLineVisualization);
}

drawLineVisualization();

// ======== UNDO/REDO ========

const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

// Drawing History
let undoStack = [canvas.toDataURL()];
let redoStack = [];

let img = new Image;
let source = undoStack[undoStack.length - 1];

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
    tool = Tool.PENCIL;
    ctx.lineCap = "square";
    ctx.globalCompositeOperation = "source-over";
});

// ======== BRUSH ========
const brushBtn = document.getElementById("brush-btn");

brushBtn.addEventListener("click", () => {
    tool = Tool.BRUSH;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "source-over";
});

// ======== LINE ========
const lineBtn = document.getElementById("line-btn");

lineBtn.addEventListener("click", () => {
    tool = Tool.LINE;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "source-over";
});

// ======== ERASER ========
const eraserBtn = document.getElementById("eraser-btn");

eraserBtn.addEventListener("click", () => {
    tool = Tool.ERASER;
    ctx.globalCompositeOperation = "destination-out";
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

sizeLbl.innerText = ctx.lineWidth / 5;

increaseBtn.addEventListener("click", () => {
    ctx.lineWidth += 5;
    sizeLbl.innerText = ctx.lineWidth / 5;
});

decreaseBtn.addEventListener("click", () => {
    ctx.lineWidth -= 5;
    sizeLbl.innerText = ctx.lineWidth / 5;
});

// -- MOUSE SCROLL --
window.addEventListener("wheel", e => {
    if (e.deltaY > 0) {
        ctx.lineWidth -= 5;
        sizeLbl.innerText = ctx.lineWidth / 5;
    } else {
        ctx.lineWidth += 5;
        sizeLbl.innerText = ctx.lineWidth / 5;
    }

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