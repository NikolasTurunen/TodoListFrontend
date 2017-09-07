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
        REMOVE_TASK: 8
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

    ctrl.isMoveTaskUpEnabled = function () {
        return ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) - 1] !== undefined;
    };

    ctrl.isMoveTaskDownEnabled = function () {
        return ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) + 1] !== undefined;
    };

    ctrl.moveTaskUp = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) - 1].id);
    };

    ctrl.moveTaskDown = function () {
        ctrl.swapTasks(ctrl.selectedTask.id, ctrl.tasks[ctrl.tasks.indexOf(ctrl.selectedTask) + 1].id);
    };

    ctrl.editTaskAction = function () {
        ctrl.dialogInputText = ctrl.selectedTask.taskString;

        ctrl.openDialog(ctrl.DIALOG.EDIT_TASK);
    };

    ctrl.controlTaskActions = [
        {text: 'Create detail', action: ctrl.openDialog.bind(null, ctrl.DIALOG.CREATE_TASK_DETAIL)},
        {text: 'Edit', action: ctrl.editTaskAction.bind(null)},
        {text: 'Move up', action: ctrl.moveTaskUp, enabled: ctrl.isMoveTaskUpEnabled},
        {text: 'Move down', action: ctrl.moveTaskDown, enabled: ctrl.isMoveTaskDownEnabled},
        {text: 'Remove', action: ctrl.openDialog.bind(null, ctrl.DIALOG.REMOVE_TASK)}
    ];

    ctrl.openControlTaskDialog = function (task) {
        ctrl.openDialog(ctrl.DIALOG.CONTROL_TASK);
        ctrl.selectedTask = task;
        ctrl.traversedTaskIndex = null;
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

    $hotkey.bind("TAB", function (event) {
        event.preventDefault();
        if (!ctrl.minimized && ctrl.isDialogOpen(null)) {
            if (!ctrl.selectedProject) {
                ctrl.traverseProject(TabTraverseHelper.DIRECTION.DOWN);
            } else {
                if (ctrl.tasks.length > 0) {
                    ctrl.traverseTask(TabTraverseHelper.DIRECTION.DOWN);
                }
            }
        }
    });

    $hotkey.bind("SHIFT+TAB", function (event) {
        event.preventDefault();
        if (!ctrl.minimized && ctrl.isDialogOpen(null)) {
            if (!ctrl.selectedProject) {
                ctrl.traverseProject(TabTraverseHelper.DIRECTION.UP);
            } else {
                if (ctrl.tasks.length > 0) {
                    ctrl.traverseTask(TabTraverseHelper.DIRECTION.UP);
                }
            }
        }
    });

    $hotkey.bind("ESC", function (event) {
        if (!ctrl.minimized) {
            if (!ctrl.selectedProject && ctrl.traversedProjectIndex !== null) {
                ctrl.traversedProjectIndex = null;
            } else if (ctrl.selectedProject && ctrl.traversedTaskIndex !== null) {
                ctrl.traversedTaskIndex = null;
            } else if (ctrl.isDialogOpen(null) && ctrl.selectedProject) {
                ctrl.selectedProject = null;
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
                    } else {
                        ctrl.openDialog(ctrl.DIALOG.CREATE_TASK);
                    }
                }
            }
        }
    });

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

    ctrl.canMoveProjectWithHotkeys = function () {
        return ctrl.traversedProjectIndex !== null && !ctrl.selectedProject && ctrl.controls && ctrl.isDialogOpen(null);
    };

    $hotkey.bind("UP", function (event) {
        if (!ctrl.minimized) {
            if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectUpEnabled(ctrl.traversedProjectIndex)) {
                ctrl.moveProjectUp(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

                ctrl.traversedProjectIndex--;
            }
        }
    });

    $hotkey.bind("DOWN", function (event) {
        if (!ctrl.minimized) {
            if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectDownEnabled(ctrl.traversedProjectIndex)) {
                ctrl.moveProjectDown(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

                ctrl.traversedProjectIndex++;
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