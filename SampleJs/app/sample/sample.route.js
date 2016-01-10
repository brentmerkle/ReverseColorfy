angular.module("sample", ["ngRoute"]).config([
    "$routeProvider", function($routeProvider) {
        "use strict";

        $routeProvider.when("/sample/", { templateUrl: "app/sample/sample.html", controller: "sampleController" });
    }
]);