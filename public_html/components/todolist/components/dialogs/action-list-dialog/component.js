function Controller($attrs, TabTraverseHelper, $hotkey) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;
    };

    ctrl.traversedActionIndex = null;

    this.$onChanges = function (changedObject) {
        if (changedObject.status !== undefined && changedObject.status.currentValue === true) {
            ctrl.traversedActionIndex = null;
        }
    };

    ctrl.traverse = function (direction) {
        for (i = 0; i < ctrl.actions.length; i++) {
            ctrl.traversedActionIndex = TabTraverseHelper.traverse(ctrl.traversedActionIndex, ctrl.actions, direction);

            if (ctrl.actions[ctrl.traversedActionIndex].enabled && ctrl.actions[ctrl.traversedActionIndex].enabled() === false) {
                continue;
            } else {
                break;
            }
        }
    };

    $hotkey.bind("TAB", function (event) {
        event.preventDefault();
        if (ctrl.status) {
            ctrl.traverse(TabTraverseHelper.DIRECTION.DOWN);
        }
    });

    $hotkey.bind("SHIFT+TAB", function (event) {
        event.preventDefault();
        if (ctrl.status) {
            ctrl.traverse(TabTraverseHelper.DIRECTION.UP);
        }
    });

    $hotkey.bind("ENTER", function (event) {
        if (ctrl.status) {
            if (ctrl.traversedActionIndex !== null) {
                ctrl.actions[ctrl.traversedActionIndex].action();
            }
        }
    });

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