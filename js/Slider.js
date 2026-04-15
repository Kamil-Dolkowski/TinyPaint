export default class Slider {
    constructor(min = 0, max = 100, value = min, id = null, className = null) {
        // variables
        this.min = min;
        this.max = max;
        this.value = value;

        this.id = id;
        this.className = className;

        this.isHorizontal = true;
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

            this.slider.dispatchEvent(new CustomEvent("change", {
                detail: { value: this.value },
                bubbles: true
            }));
        });

        this.track.addEventListener("pointermove", e => {
            if (!this.isPointerPressed) return;

            this.pointerDownAndMoveHandler(e);

            this.slider.dispatchEvent(new CustomEvent("change", {
                detail: { value: this.value },
                bubbles: true
            }));
        });

        this.track.addEventListener("pointerup", e => {
            if (!this.isPointerPressed) return;

            this.isPointerPressed = false;
            this.track.releasePointerCapture(e.pointerId);

            this.slider.dispatchEvent(new CustomEvent("change", {
                detail: { value: this.value },
                bubbles: true
            }));
        });
    }

    mount(parent) {
        parent.appendChild(this.slider);
    }

    updateLayout() {
        this.isHorizontal = this.slider.offsetWidth > this.slider.offsetHeight;

        // update thumb position
        const pos = this.denormalize(this.value);

        if (this.isHorizontal) {
            this.thumb.style.transform = `translateX(${pos - this.thumb.offsetWidth / 2}px)`;
        } else {
            this.thumb.style.transform = `translateY(${pos - this.thumb.offsetHeight / 2}px)`;
        }
    }

    createSlider() {
        const slider = document.createElement("div");

        // id and class
        if (this.id != null) slider.id = this.id;

        slider.classList.add("slider"); // base class
        if (this.className != null) slider.classList.add(this.className); // additional class

        return slider;
    }

    createTrack() {
        const track = document.createElement("div");

        // class
        track.className = "track";

        this.slider.appendChild(track);

        return track;
    }

    createThumb() {
        const thumb = document.createElement("div");

        // class
        thumb.className = "thumb";

        this.track.appendChild(thumb);

        return thumb;
    }

    // for events 'pointerdown' and 'pointermove'
    pointerDownAndMoveHandler(e) {
        const rect = this.track.getBoundingClientRect()

        if (this.isHorizontal) {
            let pos = e.clientX - rect.left;
            pos = Math.max(0, Math.min(pos, this.slider.offsetWidth));

            this.value = (this.normalize(pos));
            this.thumb.style.transform = `translateX(${pos - this.thumb.offsetWidth / 2}px)`;
        } else {
            let pos = e.clientY - rect.top;
            pos = Math.max(0, Math.min(pos, this.slider.offsetHeight));

            this.value = (this.normalize(pos));
            this.thumb.style.transform = `translateY(${pos - this.thumb.offsetHeight / 2}px)`;
        }
    }

    normalize(x) {
        // pos -> value
        // value range: [a, b] -> [this.min, this.max]
        // norm = (x - min) / (max - min) * (b - a) + a
        // min = 0, max = Math.max(this.slider.style.width, this.slider.style.height)

        const max = Math.max(this.slider.offsetWidth, this.slider.offsetHeight);
        return (x / max) * (this.max - this.min) + this.min;
    }

    denormalize(x) {
        // value -> pos
        // pos range: [a, b] -> [0, maxSize]
        // denorm = (x - min) / (max - min) * (b - a) + a
        // min = this.min, max = this.max

        const maxSize = Math.max(this.slider.offsetWidth, this.slider.offsetHeight);
        return (x - this.min) / (this.max - this.min) * maxSize;
    }
}