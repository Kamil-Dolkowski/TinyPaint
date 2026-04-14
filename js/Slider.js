export default class Slider {
    constructor(min = 0, max = 100, value = min, id = null, className = "custom-slider") {
        // variables
        this.min = min;
        this.max = max;
        this.value = value;

        this.id = id;
        this.className = className;

        this.width = 150;
        this.height = 10;
        this.isHorizontal = this.width > this.height;

        this.isPointerPressed = false;

        // elements
        this.slider = this.createSlider();
        this.track = this.createTrack();
        this.thumb = this.createThumb();

        // init/events
        this.track.addEventListener("pointerdown", e => {
            this.isPointerPressed = true;

            this.pointerDownAndMoveHandler(e);
            this.track.setPointerCapture(e.pointerId);
        });

        this.track.addEventListener("pointermove", e => {
            if (!this.isPointerPressed) return;

            this.pointerDownAndMoveHandler(e);
        });

        this.track.addEventListener("pointerup", e => {
            if (!this.isPointerPressed) return;

            this.isPointerPressed = false;
            this.track.releasePointerCapture(e.pointerId);
        });
    }

    createSlider() {
        const slider = document.createElement("div");

        // id and class
        if (this.id != null) slider.id = this.id;
        if (this.className != null) slider.className = this.className;

        // size
        slider.style.width = this.width + "px";
        slider.style.height = this.height + "px";

        slider.style.margin = "10px";
        slider.style.position = "relative";

        return slider;
    }

    createTrack() {
        const track = document.createElement("div");

        // class
        track.className = "track";

        // size
        track.style.width = this.width + "px";
        track.style.height = this.height + "px";

        // look
        track.style.borderRadius = "5px";
        track.style.backgroundColor = "#006AE8";

        this.slider.appendChild(track);

        return track;
    }

    createThumb() {
        const thumb = document.createElement("div");

        // class
        thumb.className = "thumb";

        // size
        const size = Math.min(this.width, this.height);
        thumb.style.width = size + "px";
        thumb.style.height = size + "px";

        // position
        thumb.style.position = "absolute";
        
        if (this.isHorizontal) {
            thumb.style.left = "0px";
        } else {
            thumb.style.top = "0px";
        }

        // look
        thumb.style.borderRadius = "10px";
        thumb.style.boxShadow = "0 0 0 3px #213d5f";
        thumb.style.backgroundColor = "#006AE8";

        this.track.appendChild(thumb);

        return thumb;
    }

    // for events 'pointerdown' and 'pointermove'
    pointerDownAndMoveHandler(e) {
        const rect = this.track.getBoundingClientRect()

        if (this.isHorizontal) {
            let pos = e.clientX - rect.left;
            pos = Math.max(0, Math.min(pos, this.width));

            this.value = (this.normalize(pos));
            this.thumb.style.left = pos - this.height/2 + "px";
        } else {
            let pos = e.clientY - rect.top;
            pos = Math.max(0, Math.min(pos, this.height));

            this.value = (this.normalize(pos));
            this.thumb.style.top = pos - this.width/2 + "px";
        }
    }

    normalize(x) {
        // range: [a, b]
        // norm = (x - min) / (max - min) * (b - a) + a
        // min = 0, max = Math.max(this.width, this.height)

        const max = Math.max(this.width, this.height);
        return (x / max) * (this.max - this.min) + this.min;
    }
}