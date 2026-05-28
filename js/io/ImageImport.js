export default class ImageImport {
    constructor(importBtn, canvas, history) {
        this.importBtn = importBtn;
        this.canvas = canvas;
        this.history = history;

        this.upload = this.createUpload();

        // init/events
        this.importBtn.addEventListener("click", () => {
            this.upload.click();
        });

        this.upload.addEventListener("change", e => {
            const file = e.target.files[0];
            if (!file) return;

            const img = new Image();

            img.onload = () => {
                const ctx = this.canvas.ctx;
                
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                ctx.globalCompositeOperation = "source-over";
                
                ctx.drawImage(img, 0, 0);
                ctx.restore();

                this.history.addCanvasToHistory();

                // reset value
                e.target.value = "";
            };

            img.src = URL.createObjectURL(file);
        });
    }

    createUpload() {
        const upload = document.createElement("input");

        upload.type = "file";
        upload.id = "upload";
        upload.accept = "image/*";
        upload.style.display = "none";

        return upload;
    }
}