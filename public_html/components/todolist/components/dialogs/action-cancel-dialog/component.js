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
        if (changedObject.status.currentValue === true) {
            ctrl.resetInput();
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
        text: "@",
        action: "&",
        actionText: "@",
        cancelAction: "&"
    }
});