function Controller() {
    var ctrl = this;
}

angular.module("app").component("errorDialog", {
    controller: Controller,
    templateUrl: "components/todolist/components/dialogs/error-dialog/template.html",
    bindings: {
        status: "=",
        error: "="
    }
});