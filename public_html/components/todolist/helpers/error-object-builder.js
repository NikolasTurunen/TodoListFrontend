angular.module("app").factory("ErrorObjectBuilder", function () {
    return {
        build: function (error, message) {
            if (error.data === null) {
                error.data = {};
            }

            error.data.clientMessage = message;

            return error.data;
        }
    };
});