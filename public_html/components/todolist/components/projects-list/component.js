function Controller(ProjectsService, Dialog, TabTraverseHelper, $hotkey) {
    var ctrl = this;

    ctrl.Dialog = Dialog;

    ctrl.traversedProjectIndex = null;

    ctrl.controls = false;

    ctrl.dialogInputText = null;

    ctrl.selectProject = function (project) {
        ctrl.selectedProject = project;

        ctrl.traversedProjectIndex = null;
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
            Dialog.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.createProjectError = "Failed to create project";
        });
    };

    ctrl.swapProjects = function (projectId1, projectId2) {
        ProjectsService.swappositions.query({projectId: projectId1, projectId2: projectId2}, {}, function (data) {
            ctrl.error = null;
            Dialog.closeDialog();
            ctrl.getProjects();
        }, function (error) {
            ctrl.error = "Failed to swap projects";
        });
    };

    ctrl.renameProject = function (projectId, newName) {
        ProjectsService.rename.query({projectId: projectId, newName: newName}, {}, function (data) {
            ctrl.renameProjectError = null;
            Dialog.closeDialog();
            ctrl.dialogInputText = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.renameProjectError = "Failed to rename project";
        });
    };

    ctrl.removeProject = function (projectId) {
        ProjectsService.remove.query({projectId: projectId}, {}, function (data) {
            ctrl.removeProjectError = null;
            Dialog.closeDialog();
            ctrl.getProjects();
        }, function (error) {
            ctrl.removeProjectError = "Failed to remove project";
        });
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
        ctrl.swapProjects(project.id, ctrl.projects[index - 1].id);
    };

    ctrl.moveProjectDown = function (project, index) {
        ctrl.swapProjects(project.id, ctrl.projects[index + 1].id);
    };

    ctrl.traverseProject = function (direction) {
        ctrl.traversedProjectIndex = TabTraverseHelper.traverse(ctrl.traversedProjectIndex, ctrl.projects, direction);
    };

    $hotkey.bind("TAB", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverseProject(TabTraverseHelper.DIRECTION.DOWN);
    });

    $hotkey.bind("SHIFT+TAB", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.traverseProject(TabTraverseHelper.DIRECTION.UP);
    });

    $hotkey.bind("ESC", function (event) {
        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.traversedProjectIndex !== null) {
            ctrl.traversedProjectIndex = null;
        }
    });

    $hotkey.bind("ENTER", function (event) {
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
    });

    $hotkey.bind("UP", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectUpEnabled(ctrl.traversedProjectIndex)) {
            ctrl.moveProjectUp(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

            ctrl.traversedProjectIndex--;
        }
    });

    $hotkey.bind("DOWN", function (event) {
        event.preventDefault();

        if (!ctrl.isActive()) {
            return null;
        }

        if (ctrl.canMoveProjectWithHotkeys() && ctrl.isMoveProjectDownEnabled(ctrl.traversedProjectIndex)) {
            ctrl.moveProjectDown(ctrl.projects[ctrl.traversedProjectIndex], ctrl.traversedProjectIndex);

            ctrl.traversedProjectIndex++;
        }
    });

    $hotkey.bind("CTRL", function (event) {
        if (!ctrl.isActive()) {
            return null;
        }

        ctrl.controls = !ctrl.controls;
    });
}

angular.module("app").component("projectsList", {
    controller: Controller,
    templateUrl: "components/todolist/components/projects-list/template.html",
    bindings: {
        minimized: "=",
        selectedProject: "="
    }
});

