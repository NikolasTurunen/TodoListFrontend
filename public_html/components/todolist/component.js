function Controller(ProjectsService, TasksService, TabTraverseHelper, $hotkey) {
    var ctrl = this;
    ctrl.minimized = true;

    ctrl.currentDialog = null;

    ctrl.DIALOG = {
        CREATE_PROJECT: 1,
        RENAME_PROJECT: 2,
        REMOVE_PROJECT: 3,
        CREATE_TASK: 4,
        CONTROL_TASK: 5,
        CREATE_TASK_DETAIL: 6,
        EDIT_TASK: 7,
        REMOVE_TASK: 8,
        CONTROL_TASK_DETAIL: 9
    };

    ctrl.openDialog = function (dialog) {
        ctrl.currentDialog = dialog;
    };

    ctrl.closeDialog = function () {
        ctrl.currentDialog = null;
    };

    ctrl.isDialogOpen = function (dialog) {
        return ctrl.currentDialog === dialog;
    };

    ctrl.traversedProjectIndex = null;
    ctrl.traversedTaskIndex = null;
    ctrl.traversedTaskDetailIndex = null;

    ctrl.controls = false;

    ctrl.tasks = null;

    ctrl.dialogInputText = null;

    ctrl.selectProject = function (project) {
        ctrl.tasks = null;
        ctrl.getTasks(project.id);

        ctrl.selectedProject = project;

        ctrl.traversedProjectIndex = null;
        ctrl.traversedTaskIndex = null;
    };

    ctrl.getProjects = function () {
        ctrl.loadingProjects = true;
        ProjectsService.get.query(function (data) {
            ctrl.projects = data;
            ctrl.error = null;
            ctrl.loadingProjects = false;
        }, function (error) {
            ctrl.error = "Failed to get projects";
            ctrl.projects = null;
            ctrl.loadingProjects = false;
        });
    };
    ctrl.getProjects();

    ctrl.createProject = function (projectName) {
        ProjectsService.create.query({name: projectName}, {}, function (data) {
            ctrl.createProjectError = null;
            ctrl.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.createProjectError = "Failed to create project";
        });
    };

    ctrl.swapProjects = function (projectId1, projectId2) {
        ProjectsService.swappositions.query({projectId: projectId1, projectId2: projectId2}, {}, function (data) {
            ctrl.error = null;
            ctrl.closeDialog();
            ctrl.getProjects();
        }, function (error) {
            ctrl.error = "Failed to swap projects";
        });
    };

    ctrl.renameProject = function (projectId, newName) {
        ProjectsService.rename.query({projectId: projectId, newName: newName}, {}, function (data) {
            ctrl.renameProjectError = null;
            ctrl.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.renameProjectError = "Failed to rename project";
        });
    };

    ctrl.removeProject = function (projectId) {
        ProjectsService.remove.query({projectId: projectId}, {}, function (data) {
            ctrl.removeProjectError = null;
            ctrl.closeDialog();
            ctrl.getProjects();
        }, function (error) {
            ctrl.removeProjectError = "Failed to remove project";
        });
    };

    ctrl.getTasks = function (projectId) {
        ctrl.loadingTasks = true;
        TasksService.get.query({projectId: projectId}, {}, function (data) {
            ctrl.error = null;
            ctrl.tasks = data;
            ctrl.loadingTasks = false;
        }, function (error) {
            ctrl.error = "Failed to get tasks";
            ctrl.loadingTasks = false;
        });
    };

    ctrl.createTask = function (projectId, task) {
        TasksService.create.query({projectId: projectId, task: task}, {}, function (data) {
            ctrl.createTaskError = null;
            ctrl.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.createTaskError = "Failed to create task";
        });
    };

    ctrl.createTaskDetail = function (taskId, detail) {
        TasksService.createdetail.query({taskId: taskId, detail: detail}, {}, function (data) {
            ctrl.createTaskDetailError = null;
            ctrl.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.createTaskDetailError = "Failed to create task detail";
        });
    };

    ctrl.editTask = function (taskId, newTask) {
        TasksService.edit.query({taskId: taskId, newTask: newTask}, {}, function (data) {
            ctrl.editTaskError = null;
            ctrl.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.editTaskError = "Failed to edit task";
        });
    };

    ctrl.swapTasks = function (taskId, taskId2) {
        TasksService.swappositions.query({taskId: taskId, taskId2: taskId2}, {}, function (data) {
            ctrl.error = null;
            ctrl.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.error = "Failed to swap tasks";
        });
    };

    ctrl.removeTask = function (taskId) {
        TasksService.remove.query({taskId: taskId}, {}, function (data) {
            ctrl.removeTaskError = null;
            ctrl.closeDialog();
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.removeTaskError = "Failed to remove task";
        });
    };

    ctrl.isMoveProjectUpEnabled = function (index) {
        return ctrl.projects[index - 1] !== undefined;
    };

    ctrl.isMoveProjectDownEnabled = function (index) {
        return ctrl.projects[index + 1] !== undefined;
    };

    ctrl.moveProjectUp = function (project, index) {
        ctrl.swapProjects(project.id, ctrl.projects[index - 1].id);
    };

    ctrl.moveProjectDown = function (project, index) {
        ctrl.swapProjects(project.id, ctrl.projects[index + 1].id);
    };

    ctrl.isMoveSelectedTaskUpEnabled = function () {
        if (ctrl.taskWorkedOn) {
            return false;
        }

        return ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) - 1] !== undefined;
    };

    ctrl.isMoveSelectedTaskDownEnabled = function () {
        if (ctrl.taskWorkedOn) {
            return false;
        }

        return ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) + 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskUpEnabled = function () {
        return ctrl.tasks[ctrl.traversedTaskIndex - 1] !== undefined;
    };

    ctrl.isMoveTraversedTaskDownEnabled = function () {
        return ctrl.tasks[ctrl.traversedTaskIndex + 1] !== undefined;
    };

    ctrl.moveSelectedTaskUp = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) - 1].id);
    };

    ctrl.moveSelectedTaskDown = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) + 1].id);
    };

    ctrl.moveTraversedTaskUp = function () {
        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex - 1].id);
    };

    ctrl.moveTraversedTaskDown = function () {
        ctrl.swapTasks(ctrl.tasks[ctrl.traversedTaskIndex].id, ctrl.tasks[ctrl.traversedTaskIndex + 1].id);
    };

    ctrl.selectTaskToWorkOn = function () {
        ctrl.taskWorkedOn = ctrl.selectedTask;
        ctrl.traversedTaskDetailIndex = null;

        ctrl.closeDialog();
    };

    ctrl.resetTaskWorkedOn = function () {
        ctrl.taskWorkedOn = null;

        ctrl.closeDialog();
    };

    ctrl.isSelectedTaskBeingWorkedOn = function () {
        return ctrl.selectedTask === ctrl.taskWorkedOn;
    };

    ctrl.isSelectedTaskNotBeingWorkedOn = function () {
        return !ctrl.isSelectedTaskBeingWorkedOn();
    };

    ctrl.editTaskAction = function () {
        ctrl.dialogInputText = ctrl.selectedTask.taskString;

        ctrl.openDialog(ctrl.DIALOG.EDIT_TASK);
    };

    ctrl.controlTaskActions = [
        {text: 'Work on', action: ctrl.selectTaskToWorkOn, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Stop working on', action: ctrl.resetTaskWorkedOn, hidden: ctrl.isSelectedTaskNotBeingWorkedOn},
        {text: 'Create detail', action: ctrl.openDialog.bind(null, ctrl.DIALOG.CREATE_TASK_DETAIL), hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Edit', action: ctrl.editTaskAction.bind(null), hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Move up', action: ctrl.moveSelectedTaskUp, enabled: ctrl.isMoveSelectedTaskUpEnabled, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Move down', action: ctrl.moveSelectedTaskDown, enabled: ctrl.isMoveSelectedTaskDownEnabled, hidden: ctrl.isSelectedTaskBeingWorkedOn},
        {text: 'Remove', action: ctrl.openDialog.bind(null, ctrl.DIALOG.REMOVE_TASK), hidden: ctrl.isSelectedTaskBeingWorkedOn}
    ];

    ctrl.isTaskWorkedOn = function (task) {
        return task === ctrl.taskWorkedOn;
    };

    ctrl.openControlTaskDialog = function (task) {
        if (!ctrl.taskWorkedOn || ctrl.isTaskWorkedOn(task)) {
            ctrl.openDialog(ctrl.DIALOG.CONTROL_TASK);
            ctrl.selectedTask = task;
            ctrl.traversedTaskIndex = null;
        }
    };

    ctrl.openControlTaskDetailDialog = function (task) {
        ctrl.openDialog(ctrl.DIALOG.CONTROL_TASK);
        ctrl.selectedTask = task;
        ctrl.traversedTaskDetailIndex = null;
    };

    ctrl.openCreateTaskDialog = function () {
        if (!ctrl.taskWorkedOn) {
            ctrl.openDialog(ctrl.DIALOG.CREATE_TASK);
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

    ctrl.isTaskBeingControlled = function () {
        return ctrl.isDialogOpen(ctrl.DIALOG.CONTROL_TASK)
                || ctrl.isDialogOpen(ctrl.DIALOG.CREATE_TASK_DETAIL)
                || ctrl.isDialogOpen(ctrl.DIALOG.EDIT_TASK)
                || ctrl.isDialogOpen(ctrl.DIALOG.REMOVE_TASK);
    };

    ctrl.traverseProject = function (direction) {
        ctrl.traversedProjectIndex = TabTraverseHelper.traverse(ctrl.traversedProjectIndex, ctrl.projects, direction);
    };

    ctrl.traverseTask = function (direction) {
        ctrl.traversedTaskIndex = TabTraverseHelper.traverse(ctrl.traversedTaskIndex, ctrl.tasks, direction);
    };

    ctrl.traverseTaskDetails = function (direction) {
        ctrl.traversedTaskDetailIndex = TabTraverseHelper.traverse(ctrl.traversedTaskDetailIndex, ctrl.taskWorkedOn.details, direction);
    };

    ctrl.traverse = function (direction) {
        if (!ctrl.minimized && ctrl.isDialogOpen(null)) {
            if (!ctrl.selectedProject) {
                ctrl.traverseProject(direction);
            } else {
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
        ctrl.traverse(TabTraverseHelper.DIRECTION.DOWN);
    });

    $hotkey.bind("SHIFT+TAB", function (event) {
        event.preventDefault();
        ctrl.traverse(TabTraverseHelper.DIRECTION.UP);
    });

    $hotkey.bind("ESC", function (event) {
        if (!ctrl.minimized) {
            if (!ctrl.selectedProject) {
                if (ctrl.traversedProjectIndex !== null) {
                    ctrl.traversedProjectIndex = null;
                }
            } else if (ctrl.selectedProject) {
                if (ctrl.taskWorkedOn && ctrl.traversedTaskDetailIndex !== null && ctrl.isDialogOpen(null)) {
                    ctrl.traversedTaskDetailIndex = null;
                } else if (ctrl.taskWorkedOn && ctrl.isDialogOpen(null)) {
                    ctrl.taskWorkedOn = null;
                } else if (ctrl.traversedTaskIndex !== null) {
                    ctrl.traversedTaskIndex = null;
                } else if (ctrl.isDialogOpen(null)) {
                    ctrl.backFromTasks();
                }
            }
        }
    });

    $hotkey.bind("ENTER", function (event) {
        if (!ctrl.minimized) {
            if (ctrl.isDialogOpen(null)) {
                if (!ctrl.selectedProject) {
                    if (ctrl.traversedProjectIndex !== null) {
                        ctrl.selectProject(ctrl.projects[ctrl.traversedProjectIndex]);
                    } else {
                        ctrl.openDialog(ctrl.DIALOG.CREATE_PROJECT);
                    }
                } else {
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
        }
    });

    ctrl.canMoveProjectWithHotkeys = function () {
        return ctrl.traversedProjectIndex !== null && !ctrl.selectedProject && ctrl.controls && ctrl.isDialogOpen(null);
    };

    ctrl.canMoveTaskWithHotkeys = function () {
        return ctrl.traversedTaskIndex !== null && ctrl.selectedProject && ctrl.isDialogOpen(null);
    };

    $hotkey.bind("UP", function (event) {
        if (!ctrl.minimized) {
            if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectUpEnabled(ctrl.traversedProjectIndex)) {
                ctrl.moveProjectUp(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

                ctrl.traversedProjectIndex--;
            } else if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskUpEnabled()) {
                ctrl.moveTraversedTaskUp();

                ctrl.traversedTaskIndex--;
            }
        }
    });

    $hotkey.bind("DOWN", function (event) {
        if (!ctrl.minimized) {
            if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectDownEnabled(ctrl.traversedProjectIndex)) {
                ctrl.moveProjectDown(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

                ctrl.traversedProjectIndex++;
            } else if (ctrl.canMoveTaskWithHotkeys() && ctrl.isMoveTraversedTaskDownEnabled()) {
                ctrl.moveTraversedTaskDown();

                ctrl.traversedTaskIndex++;
            }
        }
    });

    $hotkey.bind("CTRL", function (event) {
        if (!ctrl.selectedProject) {
            ctrl.controls = !ctrl.controls;
        }
    });
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});