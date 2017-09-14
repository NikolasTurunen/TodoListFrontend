function Controller(TasksService, Dialog, TabTraverseHelper, $hotkey, $scope) {
    var ctrl = this;

    ctrl.Dialog = Dialog;

    ctrl.traversedTaskIndex = null;
    ctrl.traversedTaskDetailIndex = null;

    ctrl.tasks = null;

    ctrl.dialogInputText = null;

    ctrl.selectTaskById = function (taskId, tasks) {
        angular.forEach(tasks, function (value, key) {
            var task = value;
            if (ctrl.selectedTask && task.id === taskId) {
                ctrl.selectTask(task);
            } else {
                ctrl.selectTaskById(taskId, task.details);
            }
        });
    };

    ctrl.setTaskWorkedOnById = function (taskId, tasks) {
        angular.forEach(tasks, function (value, key) {
            var task = value;
            if (ctrl.taskWorkedOn && task.id === taskId) {
                ctrl.taskWorkedOn = task;
            } else {
                ctrl.setTaskWorkedOnById(taskId, task.details);
            }
        });
    };

    $scope.$watch(ctrl.selectedProject, function (newValue, oldValue) {
        ctrl.resetTasks();
        ctrl.getTasks(ctrl.selectedProject.id);
    });

    ctrl.getTasks = function (projectId) {
        ctrl.loadingTasks = true;

        var selectedTaskId;
        var taskWorkedOnId;

        if (ctrl.selectedTask) {
            selectedTaskId = ctrl.selectedTask.id;
        }

        if (ctrl.taskWorkedOn) {
            taskWorkedOnId = ctrl.taskWorkedOn.id;
        }

        TasksService.get.query({projectId: projectId}, {}, function (data) {
            ctrl.error = null;
            ctrl.tasks = data;
            ctrl.loadingTasks = false;

            ctrl.selectTaskById(selectedTaskId, ctrl.tasks);
            ctrl.setTaskWorkedOnById(taskWorkedOnId, ctrl.tasks);
        }, function (error) {
            ctrl.error = "Failed to get tasks";
            ctrl.loadingTasks = false;
        });
    };

    ctrl.resetTasks = function () {
        ctrl.tasks = null;
        ctrl.traversedTaskIndex = null;
    };

    ctrl.createTask = function (projectId, task) {
        TasksService.create.query({projectId: projectId, task: task}, {}, function (data) {
            ctrl.createTaskError = null;
            Dialog.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.createTaskError = "Failed to create task";
        });
    };

    ctrl.createTaskDetail = function (taskId, detail) {
        TasksService.createdetail.query({taskId: taskId, detail: detail}, {}, function (data) {
            ctrl.createTaskDetailError = null;
            Dialog.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.createTaskDetailError = "Failed to create task detail";
        });
    };

    ctrl.editTask = function (taskId, newTask) {
        TasksService.edit.query({taskId: taskId, newTask: newTask}, {}, function (data) {
            ctrl.editTaskError = null;
            Dialog.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.editTaskError = "Failed to edit task";
        });
    };

    ctrl.swapTasks = function (taskId, taskId2) {
        TasksService.swappositions.query({taskId: taskId, taskId2: taskId2}, {}, function (data) {
            ctrl.error = null;
            Dialog.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.error = "Failed to swap tasks";
        });
    };

    ctrl.removeTask = function (taskId) {
        TasksService.remove.query({taskId: taskId}, {}, function (data) {
            ctrl.removeTaskError = null;
            Dialog.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.removeTaskError = "Failed to remove task";
        });
    };

    ctrl.findTaskById = function (taskId, tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (task.id === taskId) {
                return task;
            } else {
                var foundTask = ctrl.findTaskById(taskId, task.details);
                if (foundTask !== undefined) {
                    return foundTask;
                }
            }
        }
    };

    ctrl.isActive = function () {
        return ctrl.selectedProject;
    };

    ctrl.isMoveSelectedTaskUpEnabled = function () {
        return ctrl.selectedTaskTasks[ctrl.selectedTaskTasks.indexOf(ctrl.selectedTask) - 1] !== undefined;
    };

    ctrl.isMoveSelectedTaskDownEnabled = function () {
        return ctrl.selectedTaskTasks[ctrl.selectedTaskTasks.indexOf(ctrl.selectedTask) + 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskUpEnabled = function () {
        return ctrl.tasks[ctrl.traversedTaskIndex - 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskDownEnabled = function () {
        return ctrl.tasks[ctrl.traversedTaskIndex + 1] !== undefined;
    };

    ctrl.moveSelectedTaskUp = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.selectedTaskTasks[ctrl.selectedTaskTasks.indexOf(ctrl.selectedTask) - 1].id);
    };

    ctrl.moveSelectedTaskDown = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.selectedTaskTasks[ctrl.selectedTaskTasks.indexOf(ctrl.selectedTask) + 1].id);
    };

    ctrl.moveTraversedTaskUp = function () {
        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex - 1].id);
    };

    ctrl.moveTraversedTaskDown = function () {
        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex + 1].id);
    };

    ctrl.isMoveTraversedTaskDetailUpEnabled = function () {
        return ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex - 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskDetailDownEnabled = function () {
        return ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex + 1] !== undefined;
    };

    ctrl.moveTraversedTaskDetailUp = function () {
        ctrl.swapTasks(ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex].id, ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex - 1].id);
    };

    ctrl.moveTraversedTaskDetailDown = function () {
        ctrl.swapTasks(ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex].id, ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex + 1].id);
    };

    ctrl.selectTask = function (task) {
        if (task.parentTaskId !== null) {
            ctrl.selectedTaskTasks = ctrl.findTaskById(task.parentTaskId, ctrl.tasks).details;
        } else {
            ctrl.selectedTaskTasks = ctrl.tasks;
        }

        ctrl.selectedTask = task;
    };

    ctrl.selectTraversedTaskToWorkOn = function () {
        if (!ctrl.taskWorkedOn && ctrl.traversedTaskIndex !== null) {
            ctrl.taskWorkedOn = ctrl.tasks[ctrl.traversedTaskIndex];
            ctrl.traversedTaskIndex = null;
        } else if (ctrl.traversedTaskDetailIndex !== null) {
            ctrl.taskWorkedOn = ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex];
            ctrl.traversedTaskDetailIndex = null;
        }
    };

    ctrl.selectTaskToWorkOn = function () {
        ctrl.taskWorkedOn = ctrl.selectedTask;
        ctrl.traversedTaskDetailIndex = null;

        Dialog.closeDialog();
    };

    ctrl.resetTaskWorkedOn = function () {
        ctrl.taskWorkedOn = null;

        Dialog.closeDialog();
    };

    ctrl.isSelectedTaskBeingWorkedOn = function () {
        return ctrl.selectedTask === ctrl.taskWorkedOn;
    };

    ctrl.isSelectedTaskNotBeingWorkedOn = function () {
        return !ctrl.isSelectedTaskBeingWorkedOn();
    };

    ctrl.editTaskAction = function () {
        ctrl.dialogInputText = ctrl.selectedTask.taskString;

        Dialog.openDialog(Dialog.DIALOG.EDIT_TASK);
    };

    ctrl.controlTaskActions = [
        {text: 'Work on', action: ctrl.selectTaskToWorkOn, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Stop working on', action: ctrl.resetTaskWorkedOn, hidden: ctrl.isSelectedTaskNotBeingWorkedOn},
        {text: 'Create detail', action: Dialog.openDialog.bind(null, Dialog.DIALOG.CREATE_TASK_DETAIL)},
        {text: 'Edit', action: ctrl.editTaskAction.bind(null)},
        {text: 'Move up', action: ctrl.moveSelectedTaskUp, enabled: ctrl.isMoveSelectedTaskUpEnabled, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Move down', action: ctrl.moveSelectedTaskDown, enabled: ctrl.isMoveSelectedTaskDownEnabled, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Remove', action: Dialog.openDialog.bind(null, Dialog.DIALOG.REMOVE_TASK)}
    ];

    ctrl.isTaskWorkedOn = function (task) {
        return task === ctrl.taskWorkedOn;
    };

    ctrl.openControlTaskDialog = function (task) {
        if (!ctrl.taskWorkedOn || ctrl.isTaskWorkedOn(task)) {
            Dialog.openDialog(Dialog.DIALOG.CONTROL_TASK);
            ctrl.selectTask(task);
            ctrl.traversedTaskIndex = null;
        }
    };

    ctrl.openControlTaskDetailDialog = function (task) {
        Dialog.openDialog(Dialog.DIALOG.CONTROL_TASK);
        ctrl.selectTask(task);
        ctrl.traversedTaskDetailIndex = null;
    };

    ctrl.openCreateTaskDialog = function () {
        if (!ctrl.taskWorkedOn) {
            Dialog.openDialog(Dialog.DIALOG.CREATE_TASK);
        }
    };

    ctrl.backFromTasks = function () {
        ctrl.selectedProject = null;
        ctrl.error = null;
    };

    ctrl.isTaskSelected = function (task, index) {
        return (task === ctrl.selectedTask && ctrl.isTaskBeingControlled())
                || (ctrl.traversedTaskIndex === index && !ctrl.isTaskBeingControlled())
                || task === ctrl.taskWorkedOn;
    };

    ctrl.isTaskDetailSelected = function (detail, index) {
        return (detail === ctrl.selectedTask && ctrl.isTaskBeingControlled())
                || (ctrl.traversedTaskDetailIndex === index && ctrl.taskWorkedOn && detail.parentTaskId === ctrl.taskWorkedOn.id && !ctrl.isTaskBeingControlled())
                || detail === ctrl.taskWorkedOn;
    };

    ctrl.isTaskBeingControlled = function () {
        return Dialog.isDialogOpen(Dialog.DIALOG.CONTROL_TASK)
                || Dialog.isDialogOpen(Dialog.DIALOG.CREATE_TASK_DETAIL)
                || Dialog.isDialogOpen(Dialog.DIALOG.EDIT_TASK)
                || Dialog.isDialogOpen(Dialog.DIALOG.REMOVE_TASK);
    };

    ctrl.traverseTask = function (direction) {
        ctrl.traversedTaskIndex = TabTraverseHelper.traverse(ctrl.traversedTaskIndex, ctrl.tasks, direction);
    };

    ctrl.traverseTaskDetails = function (direction) {
        ctrl.traversedTaskDetailIndex = TabTraverseHelper.traverse(ctrl.traversedTaskDetailIndex, ctrl.taskWorkedOn.details, direction);
    };

    ctrl.traverse = function (direction) {
        if (!ctrl.minimized && Dialog.isDialogOpen(null)) {
            if (ctrl.selectedProject) {
                if (ctrl.tasks.length > 0) {
                    if (!ctrl.taskWorkedOn) {
                        ctrl.traverseTask(direction);
                    } else {
                        ctrl.traverseTaskDetails(direction);
                    }
                }
            }
        }
    };

    $hotkey.bind("TAB", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverse(TabTraverseHelper.DIRECTION.DOWN);
    });

    $hotkey.bind("SHIFT+TAB", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverse(TabTraverseHelper.DIRECTION.UP);
    });

    $hotkey.bind("ESC", function (event) {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.taskWorkedOn && ctrl.traversedTaskDetailIndex !== null && Dialog.isDialogOpen(null)) {
                ctrl.traversedTaskDetailIndex = null;
            } else if (ctrl.taskWorkedOn && Dialog.isDialogOpen(null)) {
                ctrl.taskWorkedOn = null;
            } else if (ctrl.traversedTaskIndex !== null) {
                ctrl.traversedTaskIndex = null;
            } else if (Dialog.isDialogOpen(null)) {
                ctrl.backFromTasks();
            }
        }
    });

    $hotkey.bind("ENTER", function (event) {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (Dialog.isDialogOpen(null)) {
                if (ctrl.traversedTaskIndex !== null) {
                    ctrl.openControlTaskDialog(ctrl.tasks[ctrl.traversedTaskIndex]);
                } else if (ctrl.traversedTaskDetailIndex !== null) {
                    ctrl.openControlTaskDetailDialog(ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex]);
                } else if (ctrl.taskWorkedOn) {
                    ctrl.openControlTaskDialog(ctrl.taskWorkedOn);
                } else if (!ctrl.taskWorkedOn) {
                    ctrl.openCreateTaskDialog();
                }
            }
        }
    });

    ctrl.canMoveTaskWithHotkeys = function () {
        return ctrl.traversedTaskIndex !== null && ctrl.selectedProject && Dialog.isDialogOpen(null);
    };

    ctrl.canMoveTaskDetailWithHotkeys = function () {
        return ctrl.traversedTaskDetailIndex !== null && ctrl.selectedProject && Dialog.isDialogOpen(null);
    };

    $hotkey.bind("UP", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskUpEnabled()) {
                ctrl.moveTraversedTaskUp();

                ctrl.traversedTaskIndex--;
            } else if (ctrl.canMoveTaskDetailWithHotkeys() && ctrl.isMoveTraversedTaskDetailUpEnabled()) {
                ctrl.moveTraversedTaskDetailUp();

                ctrl.traversedTaskDetailIndex--;
            }
        }
    });

    $hotkey.bind("DOWN", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskDownEnabled()) {
                ctrl.moveTraversedTaskDown();

                ctrl.traversedTaskIndex++;
            } else if (ctrl.canMoveTaskDetailWithHotkeys() && ctrl.isMoveTraversedTaskDetailDownEnabled()) {
                ctrl.moveTraversedTaskDetailDown();

                ctrl.traversedTaskDetailIndex++;
            }
        }
    });

    $hotkey.bind("CTRL", function (event) {
        if (!ctrl.isActive()) {
            return null;
        }

        if (Dialog.isDialogOpen(null)) {
            ctrl.selectTraversedTaskToWorkOn();
        }
    });
}

angular.module("app").component("tasksList", {
    controller: Controller,
    templateUrl: "components/todolist/components/tasks-list/template.html",
    bindings: {
        minimized: "=",
        selectedProject: "="
    }
});