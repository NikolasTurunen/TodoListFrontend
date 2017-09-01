function Controller($attrs) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;

        if (ctrl.textInput !== undefined) {
            ctrl.textInput = null;
        }
    };
}

angular.module("app").component("actionCancelDialog", {
    controller: Controller,
    templateUrl: "components/todolist/components/action-cancel-dialog/template.html",
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