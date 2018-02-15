function Controller(TasksService, Dialog, TabTraverseHelper, ErrorObjectBuilder, $scope) {
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

    ctrl.setTaskToBeMovedById = function (taskId, tasks) {
        angular.forEach(tasks, function (value, key) {
            var task = value;
            if (ctrl.taskBeingMoved && task.id === taskId) {
                ctrl.taskBeingMoved = task;
            } else {
                ctrl.setTaskToBeMovedById(taskId, task.details);
            }
        });
    };

    $scope.$watch(ctrl.selectedProject, function (newValue, oldValue) {
        ctrl.resetTasks();
        ctrl.loadingTasks = true;
        ctrl.getTasks(ctrl.selectedProject.id);
    });

    ctrl.serviceCallsBlocked = false;

    ctrl.blockServiceCalls = function () {
        ctrl.serviceCallsBlocked = true;
    };

    ctrl.unblockServiceCalls = function () {
        ctrl.serviceCallsBlocked = false;
    };

    ctrl.getTasks = function (projectId, callback) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            var selectedTaskId;
            var taskWorkedOnId;
            var taskBeingMovedId;

            if (ctrl.selectedTask) {
                selectedTaskId = ctrl.selectedTask.id;
            }

            if (ctrl.taskWorkedOn) {
                taskWorkedOnId = ctrl.taskWorkedOn.id;
            }

            if (ctrl.taskBeingMoved) {
                taskBeingMovedId = ctrl.taskBeingMoved.id;
            }

            TasksService.get.query({projectId: projectId}, {}, function (data) {
                ctrl.tasks = data;
                ctrl.loadingTasks = false;

                ctrl.selectTaskById(selectedTaskId, ctrl.tasks);
                ctrl.setTaskWorkedOnById(taskWorkedOnId, ctrl.tasks);
                ctrl.setTaskToBeMovedById(taskBeingMovedId, ctrl.tasks);

                ctrl.loadingTasksError = false;

                if (callback) {
                    callback();
                }

                ctrl.unblockServiceCalls();
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to get tasks");
                ctrl.loadingTasksError = ctrl.error;

                ctrl.loadingTasks = false;
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.resetTasks = function () {
        ctrl.tasks = null;
        ctrl.traversedTaskIndex = null;
    };

    ctrl.createTask = function (projectId, task) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.create.query({projectId: projectId, task: task}, {}, function (data) {
                ctrl.dialogInputText = null;
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to create task");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.createTaskDetail = function (taskId, detail) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.createdetail.query({taskId: taskId, detail: detail}, {}, function (data) {
                ctrl.dialogInputText = null;
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to create task detail");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.editTask = function (taskId, newTask) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.edit.query({taskId: taskId, newTask: newTask}, {}, function (data) {
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to edit task");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.swapTasks = function (taskId, taskId2, callback) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.swappositions.query({taskId: taskId, taskId2: taskId2}, {}, function (data) {
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id, callback);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to swap tasks");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.removeTask = function (taskId) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.remove.query({taskId: taskId}, {}, function (data) {
                if (ctrl.taskWorkedOn && ctrl.taskWorkedOn.id === taskId) {
                    ctrl.taskWorkedOn = null;
                }
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to remove task");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.completeTask = function (taskId) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.complete.query({taskId: taskId}, {}, function (data) {
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to complete task");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.uncompleteTask = function (taskId) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.uncomplete.query({taskId: taskId}, {}, function (data) {
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to uncomplete task");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.moveTask = function (taskId, newParentTaskId, newProjectId) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            TasksService.move.query({taskId: taskId, newParentTaskId: newParentTaskId, newProjectId: newProjectId}, {}, function (data) {
                ctrl.unblockServiceCalls();

                ctrl.getTasks(ctrl.selectedProject.id);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to move task");
                ctrl.unblockServiceCalls();
            });
        }
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
        var callback = function () {
            ctrl.traversedTaskIndex--;
        };

        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex - 1].id, callback);
    };

    ctrl.moveTraversedTaskDown = function () {
        var callback = function () {
            ctrl.traversedTaskIndex++;
        };

        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex + 1].id, callback);
    };

    ctrl.isMoveTraversedTaskDetailUpEnabled = function () {
        return ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex - 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskDetailDownEnabled = function () {
        return ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex + 1] !== undefined;
    };

    ctrl.moveTraversedTaskDetailUp = function () {
        var callback = function () {
            ctrl.traversedTaskDetailIndex--;
        };

        ctrl.swapTasks(ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex].id, ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex - 1].id, callback);
    };

    ctrl.moveTraversedTaskDetailDown = function () {
        var callback = function () {
            ctrl.traversedTaskDetailIndex++;
        };

        ctrl.swapTasks(ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex].id, ctrl.taskWorkedOn.details[ctrl.traversedTaskDetailIndex + 1].id, callback);
    };

    ctrl.selectTask = function (task) {
        if (task.parentTaskId !== null) {
            ctrl.selectedTaskTasks = ctrl.findTaskById(task.parentTaskId, ctrl.tasks).details;
        } else {
            ctrl.selectedTaskTasks = ctrl.tasks;
        }

        ctrl.selectedTask = task;
    };

    ctrl.selectTraversedTask = function () {
        ctrl.selectTask(ctrl.tasks[ctrl.traversedTaskIndex]);
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
    };

    ctrl.resetTaskWorkedOn = function () {
        ctrl.taskWorkedOn = null;
    };

    ctrl.startOrStopWorkingOnSelectedTask = function () {
        if (!ctrl.isSelectedTaskBeingWorkedOn()) {
            ctrl.selectTaskToWorkOn();
        } else {
            ctrl.resetTaskWorkedOn();
        }
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

    ctrl.isSelectedTaskCompleted = function () {
        return ctrl.selectedTask.completed;
    };

    ctrl.isSelectedTaskNotCompleted = function () {
        return !ctrl.isSelectedTaskCompleted();
    };

    ctrl.completeSelectedTask = function () {
        ctrl.completeTask(ctrl.selectedTask.id);
    };

    ctrl.uncompleteSelectedTask = function () {
        ctrl.uncompleteTask(ctrl.selectedTask.id);
    };

    ctrl.isTaskBeingMoved = function (task) {
        if (task !== undefined) {
            return task === ctrl.taskBeingMoved;
        }

        return !ctrl.isTaskNotBeingMoved();
    };

    ctrl.isTaskNotBeingMoved = function () {
        if (ctrl.taskBeingMoved) {
            return false;
        }

        return true;
    };

    ctrl.setSelectedTaskAsParentOfTaskBeingMoved = function () {
        ctrl.moveTask(ctrl.taskBeingMoved.id, ctrl.selectedTask.id);

        ctrl.taskBeingMoved = null;
    };

    ctrl.clearParentTaskOfTaskBeingMoved = function () {
        ctrl.moveTask(ctrl.taskBeingMoved.id, "");

        ctrl.taskBeingMoved = null;
    };

    ctrl.setProjectOfTaskBeingMoved = function () {
        ctrl.moveTask(ctrl.taskBeingMoved.id, "", ctrl.selectedProject.id);

        ctrl.taskBeingMoved = null;
    };

    ctrl.setSelectedTaskToBeMoved = function () {
        ctrl.taskBeingMoved = ctrl.selectedTask;
    };

    ctrl.resetTaskToBeMoved = function () {
        ctrl.taskBeingMoved = null;
    };

    ctrl.isSetAsParentActionHidden = function () {
        return ctrl.isTaskNotBeingMoved();
    };

    ctrl.isSetAsParentActionEnabled = function () {
        if (!ctrl.taskBeingMoved) {
            return false;
        }

        if (ctrl.taskBeingMoved === ctrl.selectedTask) {
            return false;
        }

        if (ctrl.taskBeingMoved.parentTaskId === ctrl.selectedTask.id) {
            return false;
        }

        if (ctrl.isTaskLowerInHierarchy(ctrl.taskBeingMoved, ctrl.selectedTask)) {
            return false;
        }

        return true;
    };

    ctrl.isTaskLowerInHierarchy = function (task, taskSearched) {
        for (var i = 0; i < task.details.length; i++) {
            var detail = task.details[i];

            if (taskSearched.id === detail.id) {
                return true;
            }

            if (ctrl.isTaskLowerInHierarchy(detail, taskSearched)) {
                return true;
            }
        }

        return false;
    };

    ctrl.isCancelMoveActionHidden = function () {
        return ctrl.isTaskNotBeingMoved();
    };

    ctrl.isWorkOnActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskBeingWorkedOn();
    };

    ctrl.isStopWorkingOnActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskNotBeingWorkedOn();
    };

    ctrl.isCreateDetailActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return false;
    };

    ctrl.isEditActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return false;
    };

    ctrl.isMoveUpActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskBeingWorkedOn();
    };

    ctrl.isMoveDownActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskBeingWorkedOn();
    };

    ctrl.isMoveLocationActionHidden = function () {
        return ctrl.isTaskBeingMoved();
    };

    ctrl.isCompleteActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskCompleted();
    };

    ctrl.isUncompleteActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return ctrl.isSelectedTaskNotCompleted();
    };

    ctrl.isRemoveActionHidden = function () {
        if (ctrl.isTaskBeingMoved()) {
            return true;
        }

        return false;
    };

    ctrl.controlTaskActions = [
        {text: 'Set as parent', action: ctrl.setSelectedTaskAsParentOfTaskBeingMoved, enabled: ctrl.isSetAsParentActionEnabled, hidden: ctrl.isSetAsParentActionHidden},
        {text: 'Cancel move', action: ctrl.resetTaskToBeMoved, hidden: ctrl.isCancelMoveActionHidden},
        {text: 'Work on', action: ctrl.selectTaskToWorkOn, hidden: ctrl.isWorkOnActionHidden},
        {text: 'Stop working on', action: ctrl.resetTaskWorkedOn, hidden: ctrl.isStopWorkingOnActionHidden},
        {text: 'Create detail', action: Dialog.openDialog.bind(null, Dialog.DIALOG.CREATE_TASK_DETAIL), hidden: ctrl.isCreateDetailActionHidden},
        {text: 'Edit', action: ctrl.editTaskAction.bind(null), hidden: ctrl.isEditActionHidden},
        {text: 'Move up', action: ctrl.moveSelectedTaskUp, enabled: ctrl.isMoveSelectedTaskUpEnabled, hidden: ctrl.isMoveUpActionHidden},
        {text: 'Move down', action: ctrl.moveSelectedTaskDown, enabled: ctrl.isMoveSelectedTaskDownEnabled, hidden: ctrl.isMoveDownActionHidden},
        {text: 'Move location', action: ctrl.setSelectedTaskToBeMoved, hidden: ctrl.isMoveLocationActionHidden},
        {text: 'Complete', action: ctrl.completeSelectedTask, hidden: ctrl.isCompleteActionHidden},
        {text: 'Uncomplete', action: ctrl.uncompleteSelectedTask, hidden: ctrl.isUncompleteActionHidden},
        {text: 'Remove', action: Dialog.openDialog.bind(null, Dialog.DIALOG.REMOVE_TASK), hidden: ctrl.isRemoveActionHidden}
    ];

    ctrl.isTaskWorkedOn = function (task) {
        return task === ctrl.taskWorkedOn;
    };

    ctrl.isTaskCompleted = function (task) {
        return task.completed;
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
        if (!ctrl.taskWorkedOn && !ctrl.taskBeingMoved) {
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

    ctrl.isTaskGrayed = function (task) {
        return ctrl.taskWorkedOn && !ctrl.isTaskWorkedOn(task);
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

    ctrl.processDialogSpecificHotkeys = function (key) {
        if (Dialog.isDialogOpen(Dialog.DIALOG.CONTROL_TASK) && !ctrl.taskBeingMoved) {
            switch (key) {
                case "CTRL":
                    ctrl.startOrStopWorkingOnSelectedTask();
                    break;
                case "UP":
                    if (ctrl.isMoveSelectedTaskUpEnabled() && !ctrl.isSelectedTaskBeingWorkedOn()) {
                        ctrl.moveSelectedTaskUp();
                    }
                    break;
                case "DOWN":
                    if (ctrl.isMoveSelectedTaskDownEnabled() && !ctrl.isSelectedTaskBeingWorkedOn()) {
                        ctrl.moveSelectedTaskDown();
                    }
                    break;
                case "DEL":
                    Dialog.openDialog(Dialog.DIALOG.REMOVE_TASK);
                    break;
            }
        }
    };

    ctrl.processHotkeyControlTaskDialog = null;
    ctrl.processHotkeyCreateTaskDetailDialog = null;
    ctrl.processHotkeyCreateTaskDialog = null;
    ctrl.processHotkeyEditTaskDialog = null;
    ctrl.processHotkeyRemoveTaskDialog = null;

    ctrl.processHotkeyDialog = function (key) {
        ctrl.processHotkeyControlTaskDialog(key);
        ctrl.processHotkeyCreateTaskDetailDialog(key);
        ctrl.processHotkeyCreateTaskDialog(key);
        ctrl.processHotkeyEditTaskDialog(key);
        ctrl.processHotkeyRemoveTaskDialog(key);
    };

    ctrl.processHotkey = function (key) {
        if (!Dialog.isDialogOpen(null)) {
            ctrl.processDialogSpecificHotkeys(key);

            ctrl.processHotkeyDialog(key);
        } else {
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
                case "UP":
                    ctrl.processHotkeyUp();
                    break;
                case "DOWN":
                    ctrl.processHotkeyDown();
                    break;
                case "CTRL":
                    ctrl.processHotkeyCtrl();
                    break;
                case "DEL":
                    ctrl.processHotkeyDel();
                    break;
            }
        }
    };

    ctrl.processHotkeyTab = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverse(TabTraverseHelper.DIRECTION.DOWN);
    };

    ctrl.processHotkeyShiftTab = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverse(TabTraverseHelper.DIRECTION.UP);
    };

    ctrl.processHotkeyEsc = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.taskWorkedOn && ctrl.traversedTaskDetailIndex !== null && Dialog.isDialogOpen(null)) {
                ctrl.traversedTaskDetailIndex = null;
            } else if (ctrl.taskWorkedOn && Dialog.isDialogOpen(null)) {
                ctrl.taskWorkedOn = null;
            } else if (ctrl.taskBeingMoved) {
                ctrl.taskBeingMoved = null;
            } else if (ctrl.traversedTaskIndex !== null) {
                ctrl.traversedTaskIndex = null;
            } else if (Dialog.isDialogOpen(null)) {
                ctrl.backFromTasks();
            }
        }
    };

    ctrl.processHotkeyEnter = function () {
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
                } else if (!ctrl.taskWorkedOn && !ctrl.taskBeingMoved) {
                    ctrl.openCreateTaskDialog();
                }
            }
        }
    };

    ctrl.canMoveTaskWithHotkeys = function () {
        return ctrl.traversedTaskIndex !== null && ctrl.selectedProject && Dialog.isDialogOpen(null) && !ctrl.taskBeingMoved;
    };

    ctrl.canMoveTaskDetailWithHotkeys = function () {
        return ctrl.traversedTaskDetailIndex !== null && ctrl.selectedProject && Dialog.isDialogOpen(null) && !ctrl.taskBeingMoved;
    };

    ctrl.processHotkeyUp = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskUpEnabled()) {
                ctrl.moveTraversedTaskUp();
            } else if (ctrl.canMoveTaskDetailWithHotkeys() && ctrl.isMoveTraversedTaskDetailUpEnabled()) {
                ctrl.moveTraversedTaskDetailUp();
            }
        }
    };

    ctrl.processHotkeyDown = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.minimized) {
            if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskDownEnabled()) {
                ctrl.moveTraversedTaskDown();
            } else if (ctrl.canMoveTaskDetailWithHotkeys() && ctrl.isMoveTraversedTaskDetailDownEnabled()) {
                ctrl.moveTraversedTaskDetailDown();
            }
        }
    };

    ctrl.processHotkeyCtrl = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (Dialog.isDialogOpen(null) && !ctrl.taskBeingMoved) {
            ctrl.selectTraversedTaskToWorkOn();
        }
    };

    ctrl.processHotkeyDel = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (!ctrl.taskBeingMoved) {
            ctrl.selectTraversedTask();
            Dialog.openDialog(Dialog.DIALOG.REMOVE_TASK);
        }
    };
}

angular.module("app").component("tasksList", {
    controller: Controller,
    templateUrl: "components/todolist/components/tasks-list/template.html",
    bindings: {
        minimized: "=",
        selectedProject: "=",
        taskBeingMoved: "=",
        error: "=",
        processHotkey: "="
    }
});