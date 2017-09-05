angular.module("app", [
    "ngResource"
]);

angular.module("app").directive('focusMe', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.focusMe, function (value) {
                if (value === true) {
                    element[0].focus();
                    element[0].select();
                }
            });
        }
    };
});