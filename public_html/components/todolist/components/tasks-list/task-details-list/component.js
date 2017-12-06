function Controller($attrs) {
    var ctrl = this;
    ctrl.attributes = $attrs;

    ctrl.isGrayed = function (detail) {
        return !ctrl.isAnyParentTaskWorkedOn && ctrl.taskWorkedOn && !ctrl.isTaskWorkedOn(detail);
    };

    ctrl.isCompleted = function (detail) {
        return ctrl.isAnyParentTaskCompleted || detail.completed;
    };

    ctrl.isBeingMoved = function (detail) {
        return ctrl.isAnyParentTaskBeingMoved || ctrl.isTaskBeingMoved(detail);
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
        isTaskBeingMoved: "<",
        isAnyParentTaskWorkedOn: "<",
        isAnyParentTaskCompleted: "<",
        isAnyParentTaskBeingMoved: "<",
        openControlTaskDetailDialog: "<"
    }
});

