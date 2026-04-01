import ToolBase from './ToolBase.js';
import Tool from './Tool.js';

export default class Pencil extends ToolBase {
    constructor(ctx, cursorCtx, drawingStatus) {
        super(Tool.PENCIL, ctx, cursorCtx, drawingStatus);
    }

    setTool() {
        this.ctx.globalCompositeOperation = "source-over";
    }

    pointerdown(e) {
        const currentX = Math.floor(this.drawingStatus.currentX);
        const currentY = Math.floor(this.drawingStatus.currentY);

        this.ctx.fillRect(currentX, currentY, 1, 1);
    }

    pointermove(e) {
        const left = this.drawingStatus.currentX;
        const top = this.drawingStatus.currentY;

        const imageData = this.ctx.getImageData(left, top, 1, 1);
        const data = imageData.data;

        const {r,g,b} = this.hashToRGB(this.ctx.strokeStyle);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = r;
            data[i+1] = g;
            data[i+2] = b;
            data[i+3] = 255;
        }

        this.ctx.putImageData(imageData, left, top);

        this.drawingStatus.lastX = this.drawingStatus.currentX;
        this.drawingStatus.lastY = this.drawingStatus.currentY;
    }

    pointerup(e) {

    }

    drawCursor() {
        this.cursorCtx.clearRect(0, 0, this.drawingStatus.canvasWidth, this.drawingStatus.canvasHeight);

        const currentX = Math.floor(this.drawingStatus.currentX);
        const currentY = Math.floor(this.drawingStatus.currentY);

        this.cursorCtx.fillStyle = this.ctx.strokeStyle;

        this.cursorCtx.fillRect(currentX, currentY, 1, 1);
    }

    drawAnimationFrame() {
        
    }

    setPixel(x, y, rgb) {

    }

    interpolation(x, x0, y0, x1, y1) {
        return y0 + ((y1 - y0)/(x1 - x0)) * (x - x0);
    }

    // #ffffff -> 255, 255, 255
    hashToRGB(hash) {
        // 1. delete '#' on front
        hash = hash.slice(1); 

        // 2. divide into 3 parts (RGB)
        const rStr = hash.slice(0,2);
        const gStr = hash.slice(2,4);
        const bStr = hash.slice(4,6);

        // 3. calculate RGB [hexadecimal to decimal]
        const r = this.hexToDec(rStr[1]) + 16 * this.hexToDec(rStr[0]);
        const g = this.hexToDec(gStr[1]) + 16 * this.hexToDec(gStr[0]);
        const b = this.hexToDec(bStr[1]) + 16 * this.hexToDec(bStr[0]);

        return {r: r, g: g, b: b};
    }

    hexToDec(hex) {
        switch(hex) {
                case 'a':
                    return 10;
                case 'b':
                    return 11;
                case 'c':
                    return 12;
                case 'd':
                    return 13;
                case 'e':
                    return 14;
                case 'f':
                    return 15;
                default:
                    if (!Number.isInteger(Number(hex))) return null;

                    const number = Number(hex);
                    if (number < 0 || number > 9) return null;

                    return number;
            }
    }


}
