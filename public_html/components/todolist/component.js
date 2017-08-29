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
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});