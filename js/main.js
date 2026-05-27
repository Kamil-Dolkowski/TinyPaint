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
import ContextualToolbarManager from './managers/ContextualToolbarManager.js';

import PaletteControl from "./ui/PaletteControl.js";
import OptionSlider from "./ui/OptionSlider.js";

// ===================== CANVAS =====================

const workspace = document.getElementById("workspace");
const canvasSpace = document.getElementById("canvas-space");
const canvasBorder = document.getElementById("canvas-border");

const checkerboard = document.getElementById("checkerboard");
const mainCanvas = document.getElementById("canvas");
const cursorCanvas = document.getElementById("cursor-canvas");

const canvas = new Canvas(workspace, canvasSpace, canvasBorder, checkerboard, mainCanvas, cursorCanvas);

initSettingsModal(canvas);

// ==================== UNDO/REDO ===================

const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

const history = new History(canvas, undoBtn, redoBtn);

// ============== CONTEXTUAL TOOLBAR = ==============

const controlsContent = {
    palette: new PaletteControl(),
    size: new OptionSlider(1, 40, 1, "fa-solid fa-pen-nib"),
    alpha: new OptionSlider(1, 100, 100, "fa-solid fa-a"),
}

const ctxToolbar = document.getElementById("contextual-toolbar");

const ctxToolbarManager = new ContextualToolbarManager(ctxToolbar, controlsContent);

// ctxToolbarManager.update(["palette", "size", "alpha"]);

// ===================== PALETTE ====================

const paletteWindow = document.getElementById("palette-window");

const palette = new Palette(paletteWindow, controlsContent.palette, canvas);

// ============== TOOLS INICIALIZATION ==============

const tools = {
    pencil: {
        tool: new Pencil(canvas, drawingStatus),
        button: document.getElementById("pencil-btn")
    },
    brush: {
        tool: new Brush(canvas, drawingStatus),
        button: document.getElementById("brush-btn")
    },
    line: {
        tool: new Line(canvas, drawingStatus),
        button: document.getElementById("line-btn")
    },
    eraser: {
        tool: new Eraser(canvas, drawingStatus),
        button: document.getElementById("eraser-btn")
    },
    moveZoom: {
        tool: new MoveZoom(canvas, drawingStatus),
        button: document.getElementById("move-zoom-btn")
    },
    eyedropper: {
        tool: new Eyedropper(canvas, drawingStatus, palette),
        button: document.getElementById("eyedropper-btn")
    },
};

const gesture = new Gesture(tools.moveZoom.tool);

// ==================== MANAGERS ====================

const toolManager = new ToolManager(tools, tools.pencil.tool, gesture, history);
const interactionController = new InteractionController(toolManager);
const gestureManager = new GestureManager(canvas);
const pointerManager = new PointerManager(canvas, interactionController, gestureManager);

const wheelManager = new WheelManager(toolManager);

// ==================== KEYBOARD ====================

const shortcutManager = new ShortcutManager(history, toolManager);
const holdActionManager = new HoldActionManager(toolManager);
const keyboardManager = new KeyboardManager(shortcutManager, holdActionManager);

// ======== DRAW INITIAL SETTINGS ========
canvas.ctx.lineWidth = 1;
canvas.ctx.strokeStyle = "black";

// ======== CANVAS EVENTS ========

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
    canvas.clearCursorCanvas();
});

// 5 - tool animation
toolManager.drawToolAnimation();

// ===================== TOOLS =====================

// ======== CLEAR ========
const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.addCanvasToHistory();
});

// ======== RESET_ZOOM ========
const resetZoomBtn = document.getElementById("reset-zoom-btn");

resetZoomBtn.addEventListener("click", () => {
    canvas.fitToScreen();
});

// ======== INCREASE/DECREASE DRAW SIZE ========

// -- BUTTONS --
// const increaseBtn = document.getElementById("increase-btn");
// const decreaseBtn = document.getElementById("decrease-btn");
// const sizeLbl = document.getElementById("size-lbl");

// sizeLbl.innerText = canvas.ctx.lineWidth;

// increaseBtn.addEventListener("click", () => {
//     canvas.ctx.lineWidth += 1;
//     drawingStatus.drawSize = canvas.ctx.lineWidth;
//     sizeLbl.innerText = canvas.ctx.lineWidth;
// });

// decreaseBtn.addEventListener("click", () => {
//     canvas.ctx.lineWidth -= 1;
//     drawingStatus.drawSize = canvas.ctx.lineWidth;
//     sizeLbl.innerText = canvas.ctx.lineWidth;
// });

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
