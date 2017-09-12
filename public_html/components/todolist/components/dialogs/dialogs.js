angular.module("app").service("Dialog", function () {
    var currentDialog = null;

    return {
        DIALOG: {
            CREATE_PROJECT: 1,
            RENAME_PROJECT: 2,
            REMOVE_PROJECT: 3,
            CREATE_TASK: 4,
            CONTROL_TASK: 5,
            CREATE_TASK_DETAIL: 6,
            EDIT_TASK: 7,
            REMOVE_TASK: 8
        },
        openDialog: function (dialog) {
            currentDialog = dialog;
        },
        closeDialog: function () {
            currentDialog = null;
        },
        isDialogOpen: function (dialog) {
            return currentDialog === dialog;
        }
    };
});