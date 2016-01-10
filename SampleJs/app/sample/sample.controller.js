angular.module("serviceApp").controller("sampleController", sampleController);

sampleController.$inject = ["$scope", "$rootScope", "uiService", "$location", "notify", "$controller"];

function sampleController($scope, $rootScope, uiService, $location, notify, $controller) {

    // Instantiate base Services Controller...
    $controller("baseController", { $scope: $scope });

    $scope.$on("formInitialized", function () {
        //$scope.update();
    });

    $scope.color1 = "rgb(83,75,179)";
    $scope.color2 = "rgb(156,96,115)";
    $rootScope.sampleText = "Are we not drawn onward to new era?";

    $scope.update = function () {
        $("#result").reverseColorfy($scope.color1, $scope.color2);
    }

};