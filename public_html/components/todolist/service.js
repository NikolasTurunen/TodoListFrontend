angular.module("app").factory("ProjectsService", ["$resource", "$location",
    function ($resource, $location) {
        var url = "http://" + $location.host() + ":8082/todolist/api/projects";

        return {
            get: $resource(url, {}, {
                query: {
                    method: "GET",
                    isArray: true
                }
            }),
            create: $resource(url + "/create", {}, {
                query: {
                    method: "POST"
                }
            }),
            remove: $resource(url + "/remove", {}, {
                query: {
                    method: "POST"
                }
            }),
            rename: $resource(url + "/rename", {}, {
                query: {
                    method: "POST"
                }
            }),
            swappositions: $resource(url + "/swappositions", {}, {
                query: {
                    method: "POST"
                }
            })
        };
    }
]);

angular.module("app").factory("TasksService", ["$resource", "$location",
    function ($resource, $location) {
        var url = "http://" + $location.host() + ":8082/todolist/api/tasks";

        return {
            get: $resource(url, {}, {
                query: {
                    method: "GET",
                    isArray: true
                }
            }),
            create: $resource(url + "/create", {}, {
                query: {
                    method: "POST"
                }
            }),
            remove: $resource(url + "/remove", {}, {
                query: {
                    method: "POST"
                }
            }),
            edit: $resource(url + "/edit", {}, {
                query: {
                    method: "POST"
                }
            }),
            createdetail: $resource(url + "/createdetail", {}, {
                query: {
                    method: "POST"
                }
            }),
            swappositions: $resource(url + "/swappositions", {}, {
                query: {
                    method: "POST"
                }
            }),
            complete: $resource(url + "/complete", {}, {
                query: {
                    method: "POST"
                }
            }),
            uncomplete: $resource(url + "/uncomplete", {}, {
                query: {
                    method: "POST"
                }
            }),
            move: $resource(url + "/move", {}, {
                query: {
                    method: "POST"
                }
            })
        };
    }
]);
