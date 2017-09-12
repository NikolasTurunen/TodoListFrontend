function Controller() {
    var ctrl = this;

    ctrl.minimized = true;
    
    ctrl.selectedProject = null;
}

angular.module("app").component("todolist", {
    controller: Controller,
    templateUrl: "components/todolist/template.html"
});