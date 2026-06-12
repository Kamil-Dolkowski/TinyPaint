export default class ImageExport {
    constructor(exportBtn, canvas) {
        this.exportBtn = exportBtn;
        this.canvas = canvas;

        this.fileType = "png";

        this.exportBtn.addEventListener("click", this.save.bind(this));
    }

    save() {
        const canvasUrl = this.canvas.toDataURL(`image/${this.fileType}`);

        const link = document.createElement('a');
        link.href = canvasUrl;
        link.download = `new_picture.${this.fileType}`;
        link.click();
    }
}