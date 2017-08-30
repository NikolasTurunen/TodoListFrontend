function Controller(ProjectsService) {
    var ctrl = this;
    ctrl.minimized = true;

    ctrl.tasks = null;

    ctrl.selectProject = function (project) {
        // Get tasks of project by id
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
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});