import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Eyedropper extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus, palette) {
        super(Tool.EYEDROPPER, ctx, cursorCtx, drawingStatus);

        this.palette = palette;
    }

    setTool() {
        
    }

    pointerdown(e) {
        const imageData = this.ctx.getImageData(this.drawingStatus.currentX, this.drawingStatus.currentY, 1, 1);
        const data = imageData.data;

        const hex = this.rgbToHex(data[0], data[1], data[2]);

        this.palette.changeColor(hex);
    }

    pointermove(e) {
        
    }

    pointerup(e) {

    }

    drawCursor() {
        
    }

    drawAnimationFrame() {
        
    }

    rgbToHex(r, g, b) {
        return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
    }
}
