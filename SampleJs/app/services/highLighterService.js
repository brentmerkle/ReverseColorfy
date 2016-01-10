angular.module("serviceApp").service("highLighterService", highLighterService);

highLighterService.$inject = ["$rootScope"];

function highLighterService($rootScope) {
    var initialize = function() {
        // Initialize High-Lighter
        $rootScope.highlight = function($event) {
            $($event.target).addClass("highlight");
        };
        $rootScope.obscure = function($event) {
            $($event.target).removeClass("highlight");
        };
    };

    return {
        initialize: initialize
    };
};