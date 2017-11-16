function Controller($hotkey) {
    var ctrl = this;

    ctrl.minimized = false;

    ctrl.selectedProject = null;

    ctrl.error = null;

    ctrl.processHotkeyProjectsList = null;
    ctrl.processHotkeyTasksList = null;

    var hotkeys = ["ENTER", "TAB", "SHIFT+TAB", "ESC", "UP", "DOWN", "CTRL", "DEL"];
    for (var i = 0; i < hotkeys.length; i++) {
        var hotkey = hotkeys[i];
        $hotkey.bind(hotkey, function (hotkey) {
            return function (event) {
                event.preventDefault();

                if (!ctrl.minimized) {
                    if (hotkey === "ENTER" && ctrl.error !== null) {
                        ctrl.error = null;
                    } else if (ctrl.error === null) {
                        if (!ctrl.selectedProject) {
                            ctrl.processHotkeyProjectsList(hotkey);
                        } else {
                            ctrl.processHotkeyTasksList(hotkey);
                        }
                    }
                }
            };
        }(hotkey));
    }
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});