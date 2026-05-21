import drawingStatus from './DrawingStatus.js';

import Tool from './tools/Tool.js';
import Pencil from './tools/Pencil.js';
import Brush from './tools/Brush.js';
import Line from './tools/Line.js';
import Eraser from './tools/Eraser.js';
import MoveZoom from './tools/MoveZoom.js';
import Eyedropper from './tools/Eyedropper.js';
import Gesture from './tools/Gesture.js';

import Canvas from './Canvas.js';
import History from './History.js';
import Palette from './colors//Palette.js';

import ImageExport from './io/ImageExport.js';
import ImageImport from './io/ImageImport.js';

import PointerManager from './managers/PointerManager.js';
import GestureManager from './managers/GestureManager.js';
import InteractionController from './managers/InteractionController.js';
import ToolManager from './managers/ToolManager.js';

import KeyboardManager from './managers/keyboard/KeyboardManager.js';
import ShortcutManager from './managers/keyboard/ShortcutManager.js';
import HoldActionManager from './managers/keyboard/HoldActionManager.js';

import WheelManager from './managers/WheelManager.js';

// ===================== CANVAS =====================
const workspace = document.getElementById("workspace");

const canvasSpace = document.getElementById("canvas-space");
const canvasBorder = document.getElementById("canvas-border");

const checkerboard = document.getElementById("checkerboard");

const canvas1 = document.getElementById("canvas");
const ctx = canvas1.getContext("2d", { willReadFrequently: true });

const cursorCanvas = document.getElementById("cursor-canvas");
const cursorCtx = cursorCanvas.getContext("2d");

const canvas = new Canvas(workspace, canvasSpace, canvasBorder, checkerboard, canvas1, cursorCanvas, drawingStatus);

initSettingsModal(canvas);

// ======== TOOLS INICIALIZATION ========
const pencil = new Pencil(ctx, cursorCtx, drawingStatus);
const brush = new Brush(ctx, cursorCtx, drawingStatus);
const line = new Line(ctx, cursorCtx, drawingStatus);
const eraser = new Eraser(ctx, cursorCtx, drawingStatus);
const moveZoom = new MoveZoom(ctx, cursorCtx, drawingStatus, canvas);



const gesture = new Gesture(moveZoom);

const toolManager = new ToolManager(pencil, gesture);
const interactionController = new InteractionController(toolManager);
const gestureManager = new GestureManager(canvas);
const pointerManager = new PointerManager(canvas, interactionController, gestureManager);

const wheelManager = new WheelManager(toolManager);



drawingStatus.currentTool = pencil;
let tempTool = null;

// ======== DRAW INITIAL SETTINGS ========
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

// ======== CANVAS EVENTS ========

// const gesture = new Gesture(moveZoom, canvas, drawingStatus);

// 1 - pointerdown
cursorCanvas.addEventListener("pointerdown", e => {
    pointerManager.pointerdown(e);
    cursorCanvas.setPointerCapture(e.pointerId);
});

// 2 - pointermove
cursorCanvas.addEventListener("pointermove", e => {
    pointerManager.pointermove(e);

    const current = pointerManager.clientToCanvasCoords({x: e.clientX, y: e.clientY});
    interactionController.drawCursor(current);
});

// 3 - pointerup
cursorCanvas.addEventListener("pointerup", e => {
    cursorCanvas.releasePointerCapture(e.pointerId);
    pointerManager.pointerup(e);
});

// 4 - pointerout
cursorCanvas.addEventListener("pointerout", e => {
    // Clear cursor canvas
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
});

// 5 - tool animation
toolManager.drawToolAnimation();

// ===================== UNDO/REDO =====================

const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

const history = new History(canvas1, ctx, undoBtn, redoBtn);
toolManager.initHistory(history);

const shortcutManager = new ShortcutManager(history);
const holdActionManager = new HoldActionManager(toolManager);
const keyboardManager = new KeyboardManager(shortcutManager, holdActionManager);

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
    toolManager.setTool(pencil);
});

// ======== BRUSH ========
const brushBtn = document.getElementById("brush-btn");

brushBtn.addEventListener("click", () => {
    toolManager.setTool(brush);
});

// ======== LINE ========
const lineBtn = document.getElementById("line-btn");

lineBtn.addEventListener("click", () => {
    toolManager.setTool(line);
});

// ======== ERASER ========
const eraserBtn = document.getElementById("eraser-btn");

eraserBtn.addEventListener("click", () => {
    toolManager.setTool(eraser);
});

// ======== BACKGROUND COLOR ========
// const bgColorBtn = document.getElementById("bgcolor-btn");

// bgColorBtn.addEventListener("click", () => {

// });

// ======== MOVE_ZOOM ========
const moveZoomBtn = document.getElementById("move-zoom-btn");

moveZoomBtn.addEventListener("click", () => {
    toolManager.setTool(moveZoom);
});

// ======== EYEDROPPER ========
const eyedropperBtn = document.getElementById("eyedropper-btn");

eyedropperBtn.addEventListener("click", () => {
    toolManager.setTool(eyedropper);
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
    ctx.lineWidth += 1;
    drawingStatus.drawSize = ctx.lineWidth;
    sizeLbl.innerText = ctx.lineWidth;
});

decreaseBtn.addEventListener("click", () => {
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
