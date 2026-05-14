// [! important note]: only keydown and keyup actions, there isn't action in between (yet?)
export default class HoldActionManager {
    constructor(toolManager) {
        this.toolManager = toolManager;

        // holdActions - constant action
        this.holdActions = {
            ctrl: {
                code: "ControlLeft",
                keydownAction: () => console.log("moveZoom"),
                keyupAction: () => console.log("default")
            }
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