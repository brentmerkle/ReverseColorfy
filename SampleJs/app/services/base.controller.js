angular.module("serviceApp").controller("baseController", baseController);

baseController.$inject = ["$scope", "$rootScope", "uiService"];

function baseController($scope, $rootScope, uiService) {
    $rootScope.bodyClass = "page-fade";
    $rootScope.isAuthorized = true;

    $scope.$on("$viewContentLoaded", function () {
        uiService.initializeUi().then(function () {
            uiService.initializeForm().then(function () {
                $rootScope.$broadcast("formInitialized");
            });
        });
    });
};