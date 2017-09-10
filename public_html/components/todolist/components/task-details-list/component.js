function Controller() {
    var ctrl = this;

    ctrl.isGrayed = function (detail) {
        return ctrl.taskWorkedOn && !ctrl.isTaskWorkedOn(detail);
    };
}

angular.module("app").component("taskDetailsList", {
    controller: Controller,
    templateUrl: "components/todolist/components/task-details-list/template.html",
    bindings: {
        task: "<",
        taskWorkedOn: "<",
        traversedTaskDetailIndex: "<",
        isTaskDetailSelected: "<",
        isTaskWorkedOn: "<",
        isAnyParentTaskWorkedOn: "<"
    }
});

