export default class Gesture {
    constructor(moveZoom) {
        this.moveZoom = moveZoom;
    }

    onInput(gestureData) {
        // transform gesture
        this.pinchZoom(gestureData);
        this.pinchMove(gestureData);
    }

    // ========= GESTURES =========

    pinchZoom(gestureData) {
        this.moveZoom.zoomIn(gestureData.middlePoint, gestureData.zoomValue, gestureData.firstZoom);
    }

    pinchMove(gestureData) {
        this.moveZoom.move(gestureData);
    }
}