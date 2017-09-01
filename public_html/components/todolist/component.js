function Controller(ProjectsService, TasksService) {
    var ctrl = this;
    ctrl.minimized = true;

    ctrl.tasks = null;

    ctrl.newProjectName = null;

    ctrl.selectProject = function (project) {
        ctrl.tasks = null;
        ctrl.getTasks(project.id);

        ctrl.selectedProject = project;
    };

    ctrl.getProjects = function () {
        ProjectsService.get.query(function (data) {
            ctrl.projects = data;
            ctrl.error = null;
        }, function (error) {
            ctrl.error = "Failed to get projects";
            ctrl.projects = null;
        });
    };
    ctrl.getProjects();

    ctrl.createProject = function (projectName) {
        ProjectsService.create.query({name: projectName}, {}, function (data) {
            ctrl.createProjectError = null;
            ctrl.createProjectDialog = false;
            ctrl.newProjectName = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.createProjectError = "Failed to create project";
        });
    };

    ctrl.swapProjects = function (projectId1, projectId2) {
        ProjectsService.swappositions.query({projectId: projectId1, projectId2: projectId2}, {}, function (data) {
            ctrl.error = null;
            ctrl.createProjectDialog = false;
            ctrl.getProjects();
        }, function (error) {
            ctrl.error = "Failed to swap projects";
        });
    };

    ctrl.renameProject = function (projectId, newName) {
        ProjectsService.rename.query({projectId: projectId, newName: newName}, {}, function (data) {
            ctrl.renameProjectError = null;
            ctrl.renameProjectDialog = false;
            ctrl.newProjectName = null;
            ctrl.getProjects();
        }, function (error) {
            ctrl.renameProjectError = "Failed to rename project";
        });
    };

    ctrl.removeProject = function (projectId) {
        ProjectsService.remove.query({projectId: projectId}, {}, function (data) {
            ctrl.removeProjectError = null;
            ctrl.removeProjectDialog = false;
            ctrl.getProjects();
        }, function (error) {
            ctrl.removeProjectError = "Failed to remove project";
        });
    };

    ctrl.getTasks = function (projectId) {
        TasksService.get.query({projectId: projectId}, {}, function (data) {
            ctrl.error = null;
            ctrl.tasks = data;
        }, function (error) {
            ctrl.error = "Failed to get tasks";
        });
    };

    ctrl.createTask = function (projectId, task) {
        TasksService.create.query({projectId: projectId, task: task}, {}, function (data) {
            ctrl.createTaskError = null;
            ctrl.createTaskDialog = false;
            ctrl.newTaskText = undefined;
            ctrl.getTasks(ctrl.selectedProject.id);
        }, function (error) {
            ctrl.createTaskError = "Failed to create task";
        });
    };
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});