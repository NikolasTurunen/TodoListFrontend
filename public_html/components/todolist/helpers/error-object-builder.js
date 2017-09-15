angular.module("app").factory("ErrorObjectBuilder", function () {
    return {
        build: function (error, message) {
            if (error.data === null) {
                error.data = {};
                error.data.status = -1;
                error.data.message = "Connection failed";
            }

            error.data.clientMessage = message;

            return error.data;
        }
    };
});