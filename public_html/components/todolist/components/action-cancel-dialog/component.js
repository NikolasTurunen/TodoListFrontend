function Controller() {
    var ctrl = this;
}

angular.module("app").component("actionCancelDialog", {
    controller: Controller,
    templateUrl: "components/todolist/components/action-cancel-dialog/template.html",
    bindings: {
        status: "=",
        titleText: "@",
        error: "=",
        textInput: "=",
        text: "@",
        action: "&",
        actionText: "@"
    }
});