// [! important note]: only keydown and keyup actions, there isn't action in between (yet?)
export default class HoldActionManager {
    constructor(toolManager) {
        this.toolManager = toolManager;

        // holdActions - constant action
        this.holdActions = {
            moveZoom: {
                code: "ControlLeft",
                keydownAction: () => this.toolManager.setToolByName("moveZoom", true),
                keyupAction: () => this.toolManager.setLastTool()
            },
            eyedropper: {
                code: "AltLeft",
                keydownAction: () => this.toolManager.setToolByName("eyedropper", true),
                keyupAction: () => this.toolManager.setLastTool()
            },
        }
    }

    handle(keyData) {
        // holdActions
        for (const holdAction of Object.values(this.holdActions)) {
            if (keyData.code === holdAction.code) {
                if (keyData.eventType == "keydown") {
                    holdAction.keydownAction();
                } else {
                    holdAction.keyupAction();
                }
            }
        }
    }
}