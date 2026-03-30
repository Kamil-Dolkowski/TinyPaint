class Pencil {
    constructor(ctx) {
        this.ctx = ctx;
    }

    setTool(tool) {
        tool = Tool.PENCIL;
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "square";
        this.ctx.globalCompositeOperation = "source-over";
    }

    startDrawing(x, y) {
        this.ctx.beginPath();
        this.ctx.fillRect(x, y, 1, 1);
        this.ctx.stroke();
    }

    draw(lastX, lastY, currentX, currentY) {
        this.ctx.save();

        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(currentX, currentY)
        this.ctx.stroke();

        this.ctx.restore();
    }

    stopDrawing() {

    }
}
