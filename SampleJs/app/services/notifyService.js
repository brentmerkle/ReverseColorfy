angular.module("serviceApp").service("notify", notify);

notify.$inject = ["$rootScope", "$location", "toaster"];

function notify($rootScope, $location, toaster) {
    var spinning = false;
    var
        showBusy = function(waitMessage) {
            if (!waitMessage)
                $rootScope.waitMessage = "Working...";
            else
                $rootScope.waitMessage = waitMessage;

            if (spinning === false) {
                spinning = true;
                $("#pleaseWaitDialog").modal("show");
            }
        };
    var
        hideBusy = function() {
            if (spinning === true) {
                $rootScope.waitMessage = "";
                $("#pleaseWaitDialog").modal("hide");
                spinning = false;
            }
        };
    var
        showInfo = function(message, header) {
            $rootScope.infoDialogHeader = header;
            $rootScope.infoDialogMessage = message;
            $rootScope.infoHeaderClass = "modal-header-primary";
            $rootScope.infoHeaderIcon = "info";
            $("#infoDialog").modal("show");
            $("#infoDialog").on("hidden.bs.modal", function() {
                $rootScope.$apply();
                $rootScope.infoDialogHeader = "";
                $rootScope.infoDialogMessage = "";
            });
        };
    var
        showError = function(errorMessage) {
            $rootScope.infoDialogHeader = "Error";
            $rootScope.infoHeaderClass = "modal-header-danger";
            $rootScope.infoHeaderIcon = "fa-exclamation-circle";
            if (errorMessage == undefined)
                $rootScope.infoDialogMessage = "An error has occurred! Please try again later.";
            else
                $rootScope.infoDialogMessage = errorMessage;
            $("#infoDialog").modal("show");
            $("#infoDialog").on("hidden.bs.modal", function() {
                $rootScope.$apply();
                $rootScope.infoDialogHeader = "";
                $rootScope.infoDialogMessage = "";
            });
        };
    var
        showWarning = function(warningMessage) {
            $rootScope.infoDialogHeader = "Error";
            $rootScope.infoHeaderClass = "modal-header-warning";
            $rootScope.infoHeaderIcon = "exclamation-triangle";
            $rootScope.infoDialogMessage = warningMessage;
            $("#infoDialog").modal("show");
            $("#infoDialog").on("hidden.bs.modal", function() {
                $rootScope.$apply();
                $rootScope.infoDialogHeader = "";
                $rootScope.infoDialogMessage = "";
            });
        };
    var
        showRedirect = function(message, header, redirectUrl) {
            $rootScope.infoDialogHeader = header;
            $rootScope.infoDialogMessage = message;
            $rootScope.infoHeaderClass = "modal-header-primary";
            $rootScope.infoHeaderIcon = "info";
            $("#infoDialog").modal("show");
            $("#infoDialog").on("hidden.bs.modal", function() {
                $location.url(redirectUrl);
                $rootScope.$apply();
                $rootScope.infoDialogHeader = "";
                $rootScope.infoDialogMessage = "";
            });
        };

    var popSuccess = function(message) {
        toaster.pop("success", message);
    };
    var popWarning = function(message) {
        toaster.pop("warning", message);
    };
    var popError = function(message) {
        toaster.pop("danger", message);
    };
    return {
        showBusy: showBusy,
        hideBusy: hideBusy,
        showInfo: showInfo,
        showWarning: showWarning,
        showError: showError,
        showRedirect: showRedirect,
        popSuccess: popSuccess,
        popWarning: popWarning,
        popError: popError
    };
};