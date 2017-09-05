function Controller($attrs) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;
    };
}

angular.module("app").component("actionListDialog", {
    controller: Controller,
    templateUrl: "components/todolist/components/dialogs/action-list-dialog/template.html",
    bindings: {
        status: "<",
        titleText: "@",
        error: "=?",
        actions: "<",
        task: "<",
        cancelAction: "&"
    }
});