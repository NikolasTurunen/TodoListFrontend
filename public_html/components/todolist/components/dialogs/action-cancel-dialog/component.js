function Controller($attrs) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.resetInput = function () {
        if (ctrl.textInput !== undefined) {
            ctrl.textInput = null;
        }
    };

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;

        ctrl.resetInput();
    };

    this.$onChanges = function (changedObject) {
        if (changedObject.status !== undefined && changedObject.status.currentValue === true) {
            ctrl.resetInput();
            if (ctrl.defaultTextInput !== undefined) {
                ctrl.textInput = ctrl.defaultTextInput;
            }
        }
    };

    ctrl.processHotkey = function (key) {
        if (key === "ENTER") {
            ctrl.processHotkeyEnter();
        } else if (key === "ESC") {
            ctrl.processHotkeyEsc();
        }
    };

    ctrl.processHotkeyEnter = function () {
        if (ctrl.status) {
            ctrl.action();
        }
    };

    ctrl.processHotkeyEsc = function () {
        if (ctrl.status) {
            ctrl.cancel();
        }
    };
}

angular.module("app").component("actionCancelDialog", {
    controller: Controller,
    templateUrl: "components/todolist/components/dialogs/action-cancel-dialog/template.html",
    bindings: {
        status: "<",
        titleText: "@",
        error: "=",
        textInput: "=?",
        defaultTextInput: "<?",
        text: "@",
        action: "&",
        actionText: "@",
        cancelAction: "&",
        processHotkey: "="
    }
});