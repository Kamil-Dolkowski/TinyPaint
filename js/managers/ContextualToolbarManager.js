export default class ContextualToolbarManager {
    constructor(toolbar, controlsContent) {
        this.toolbar = toolbar;
        this.controls = this.toolbar.querySelectorAll("[data-control]");

        this.initControlsContent(controlsContent);
    }

    initControlsContent(controlsContent) {
        this.controls.forEach(control => {
            const object = controlsContent[control.dataset.control];

            if (object?.element instanceof Node) {
                control.appendChild(object.element);
            } else {
                console.log(`! - There is no content fo control '${control.dataset.control}'`)
            }
        });
    }

    update(toolControls) {
        this.hideAll();

        const allowed = new Set(toolControls);

        this.controls.forEach(control => {
            if (allowed.has(control.dataset.control)) {
                control.classList.remove("hidden");
            }
        });
    }

    showAll() {
        this.controls.forEach(control => {
            control.classList.remove("hidden");
        });
    }

    hideAll() {
        this.controls.forEach(control => {
            control.classList.add("hidden");
        });
    }
}