function Controller() {
    var ctrl = this;

    ctrl.cancel = function () {
        ctrl.status = false;
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
        status: "=",
        titleText: "@",
        error: "=",
        textInput: "=?",
        text: "@",
        action: "&",
        actionText: "@"
    }
});