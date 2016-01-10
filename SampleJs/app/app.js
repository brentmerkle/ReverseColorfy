var serviceApp =
    angular.module("serviceApp",
    [
        "ngRoute", "ngAnimate",
        "sample"
    ]);

serviceApp.config([
    "$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {

        "use strict";

        $routeProvider.otherwise({ redirectTo: "/sample/" });
    }
]);