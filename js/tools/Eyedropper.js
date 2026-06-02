import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Eyedropper extends ToolBase {
    constructor(canvas, drawingState, palette) {
        super(Tool.EYEDROPPER, canvas, drawingState);

        this.palette = palette;
    }

    setTool() {
        
    }

    pointerdown(pointerData) {
        if (!this.isPrimaryAction(pointerData)) return;
        
        const imageData = this.ctx.getImageData(pointerData.canvas.current.x, pointerData.canvas.current.y, 1, 1);
        const data = imageData.data;

        const hex = this.rgbToHex(data[0], data[1], data[2]);

        this.palette.changeColor(hex, true);
    }

    pointermove(pointerData) {
        
    }

    pointerup(pointerData) {

    }

    drawCursor(current) {
        
    }

    drawAnimationFrame() {
        
    }

    rgbToHex(r, g, b) {
        return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
    }
}
