function Controller(ProjectsService, Dialog, TabTraverseHelper, ErrorObjectBuilder) {
    var ctrl = this;

    ctrl.Dialog = Dialog;

    ctrl.traversedProjectIndex = null;

    ctrl.controls = false;

    ctrl.dialogInputText = null;

    ctrl.selectProject = function (project) {
        ctrl.selectedProject = project;

        ctrl.traversedProjectIndex = null;
    };

    ctrl.serviceCallsBlocked = false;

    ctrl.blockServiceCalls = function () {
        ctrl.serviceCallsBlocked = true;
    };

    ctrl.unblockServiceCalls = function () {
        ctrl.serviceCallsBlocked = false;
    };

    ctrl.getProjects = function (callback) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            ProjectsService.get.query(function (data) {
                ctrl.projects = data;
                ctrl.loadingProjects = false;
                ctrl.loadingProjectsError = false;

                if (callback) {
                    callback();
                }

                ctrl.unblockServiceCalls();
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to get projects");
                ctrl.loadingProjectsError = ctrl.error;

                ctrl.projects = null;
                ctrl.loadingProjects = false;

                ctrl.unblockServiceCalls();
            });
        }
    };
    ctrl.loadingProjects = true;
    ctrl.getProjects();

    ctrl.createProject = function (projectName) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            ProjectsService.create.query({name: projectName}, {}, function (data) {
                Dialog.closeDialog();
                ctrl.dialogInputText = null;
                ctrl.unblockServiceCalls();

                ctrl.getProjects();
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to create project");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.swapProjects = function (projectId1, projectId2, callback) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            ProjectsService.swappositions.query({projectId: projectId1, projectId2: projectId2}, {}, function (data) {
                Dialog.closeDialog();
                ctrl.unblockServiceCalls();

                ctrl.getProjects(callback);
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to swap projects");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.renameProject = function (projectId, newName) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            ProjectsService.rename.query({projectId: projectId, newName: newName}, {}, function (data) {
                Dialog.closeDialog();
                ctrl.dialogInputText = null;
                ctrl.unblockServiceCalls();

                ctrl.getProjects();
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to rename project");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.removeProject = function (projectId) {
        if (!ctrl.serviceCallsBlocked) {
            ctrl.blockServiceCalls();

            ProjectsService.remove.query({projectId: projectId}, {}, function (data) {
                Dialog.closeDialog();
                ctrl.unblockServiceCalls();

                ctrl.getProjects();
            }, function (error) {
                ctrl.error = ErrorObjectBuilder.build(error, "Failed to remove project");
                ctrl.unblockServiceCalls();
            });
        }
    };

    ctrl.isActive = function () {
        return !ctrl.selectedProject;
    };

    ctrl.isMoveProjectUpEnabled = function (index) {
        return ctrl.projects[index - 1] !== undefined;
    };

    ctrl.isMoveProjectDownEnabled = function (index) {
        return ctrl.projects[index + 1] !== undefined;
    };

    ctrl.canMoveProjectWithHotkeys = function () {
        return ctrl.traversedProjectIndex !== null && !ctrl.selectedProject && ctrl.controls && Dialog.isDialogOpen(null);
    };

    ctrl.moveProjectUp = function (project, index) {
        var callback = function () {
            ctrl.traversedProjectIndex--;
        };

        ctrl.swapProjects(project.id, ctrl.projects[index - 1].id, callback);
    };

    ctrl.moveProjectDown = function (project, index) {
        var callback = function () {
            ctrl.traversedProjectIndex++;
        };

        ctrl.swapProjects(project.id, ctrl.projects[index + 1].id, callback);
    };

    ctrl.traverseProject = function (direction) {
        ctrl.traversedProjectIndex = TabTraverseHelper.traverse(ctrl.traversedProjectIndex, ctrl.projects, direction);
    };

    ctrl.processHotkeyCreateProjectDialog = null;
    ctrl.processHotkeyRenameProjectDialog = null;
    ctrl.processHotkeyRemoveProjectDialog = null;

    ctrl.processHotkeyDialog = function (key) {
        ctrl.processHotkeyCreateProjectDialog(key);
        ctrl.processHotkeyRenameProjectDialog(key);
        ctrl.processHotkeyRemoveProjectDialog(key);
    };

    ctrl.processHotkey = function (key) {
        if (!Dialog.isDialogOpen(null)) {
            ctrl.processHotkeyDialog(key);
        } else {
            switch (key) {
                case "ENTER":
                    ctrl.processHotkeyEnter();
                    break;
                case "TAB":
                    ctrl.processHotkeyTab();
                    break;
                case "SHIFT+TAB":
                    ctrl.processHotkeyShiftTab();
                    break;
                case "ESC":
                    ctrl.processHotkeyEsc();
                    break;
                case "UP":
                    ctrl.processHotkeyUp();
                    break;
                case "DOWN":
                    ctrl.processHotkeyDown();
                    break;
                case "CTRL":
                    ctrl.processHotkeyCtrl();
            }
        }
    };

    ctrl.processHotkeyTab = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverseProject(TabTraverseHelper.DIRECTION.DOWN);
    };

    ctrl.processHotkeyShiftTab = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverseProject(TabTraverseHelper.DIRECTION.UP);
    };

    ctrl.processHotkeyEsc = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.traversedProjectIndex !== null) {
            ctrl.traversedProjectIndex = null;
        }
    };

    ctrl.processHotkeyEnter = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (Dialog.isDialogOpen(null)) {
            if (ctrl.traversedProjectIndex !== null) {
                ctrl.selectProject(ctrl.projects[ctrl.traversedProjectIndex]);
            } else {
                Dialog.openDialog(Dialog.DIALOG.CREATE_PROJECT);
            }
        }
    };

    ctrl.processHotkeyUp = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectUpEnabled(ctrl.traversedProjectIndex)) {
            ctrl.moveProjectUp(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);
        }
    };

    ctrl.processHotkeyDown = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectDownEnabled(ctrl.traversedProjectIndex)) {
            ctrl.moveProjectDown(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);
        }
    };

    ctrl.processHotkeyCtrl = function () {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.controls = !ctrl.controls;
    };
}

angular.module("app").component("projectsList", {
    controller: Controller,
    templateUrl: "components/todolist/components/projects-list/template.html",
    bindings: {
        minimized: "=",
        selectedProject: "=",
        error: "=",
        processHotkey: "="
    }
});

