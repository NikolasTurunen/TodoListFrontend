function Controller($attrs, TabTraverseHelper, $hotkey, Dialog) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.executeAction = function (action) {
        Dialog.closeDialog();
        action();
    };

    ctrl.cancel = function () {
        ctrl.cancelAction();
        ctrl.error = null;
    };

    ctrl.isActionDisabled = function (action) {
        return action.enabled && !action.enabled();
    };

    ctrl.isActionHidden = function (action) {
        return action.hidden && action.hidden();
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

            if (ctrl.isActionDisabled(ctrl.actions[ctrl.traversedActionIndex]) || ctrl.isActionHidden(ctrl.actions[ctrl.traversedActionIndex])) {
                continue;
            } else {
                break;
            }
        }
    };

    ctrl.processHotkey = function (key) {
        switch (key) {
            case "TAB":
                ctrl.processHotkeyTab();
                break;
            case "SHIFT+TAB":
                ctrl.processHotkeyShiftTab();
                break;
            case "ESC":
                ctrl.processHotkeyEsc();
                break;
            case "ENTER":
                ctrl.processHotkeyEnter();
                break;
        }
    };

    ctrl.processHotkeyTab = function () {
        if (ctrl.status) {
            ctrl.traverse(TabTraverseHelper.DIRECTION.DOWN);
        }
    };

    ctrl.processHotkeyShiftTab = function () {
        if (ctrl.status) {
            ctrl.traverse(TabTraverseHelper.DIRECTION.UP);
        }
    };

    ctrl.processHotkeyEnter = function () {
        if (ctrl.status) {
            if (ctrl.traversedActionIndex !== null) {
                ctrl.executeAction(ctrl.actions[ctrl.traversedActionIndex].action);
            }
        }
    };

    ctrl.processHotkeyEsc = function () {
        if (ctrl.status) {
            ctrl.cancel();
        }
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
        cancelAction: "&",
        processHotkey: "="
    }
});