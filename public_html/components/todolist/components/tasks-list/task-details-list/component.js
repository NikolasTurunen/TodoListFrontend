function Controller($attrs) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.isGrayed = function (detail) {
        return ctrl.taskWorkedOn && !ctrl.isTaskWorkedOn(detail);
    };
}

angular.module("app").component("taskDetailsList", {
    controller: Controller,
    templateUrl: "components/todolist/components/tasks-list/task-details-list/template.html",
    bindings: {
        task: "<",
        taskWorkedOn: "<",
        traversedTaskDetailIndex: "<",
        isTaskDetailSelected: "<",
        isTaskWorkedOn: "<",
        isAnyParentTaskWorkedOn: "<",
        openControlTaskDetailDialog: "<"
    }
});

