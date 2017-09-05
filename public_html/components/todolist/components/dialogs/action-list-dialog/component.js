function Controller($attrs, $hotkey) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;
    };

    $hotkey.bind("ESC", function (event) {
        if (ctrl.status) {
            ctrl.cancel();
        }
    });
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