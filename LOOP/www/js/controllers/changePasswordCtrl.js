angular.module('app.main.controllers')

.controller('changePasswordCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $window, CONSTANTS) {
    $scope.typeOld = "password";

    $scope.toggleVisibilityOld = function() {
        if ($scope.typeOld == "password") {
            $scope.typeOld = "text";
        } else if ($scope.typeOld == "text") {
            $scope.typeOld = "password";
        }
    }

    $scope.typeNew = "password";

    $scope.toggleVisibilityNew = function() {
        if ($scope.typeNew == "password") {
            $scope.typeNew = "text";
        } else if ($scope.typeNew == "text") {
            $scope.typeNew = "password";
        }
    }

    $scope.input = {};
    $scope.changePW = function(form) {
        if (form.$valid) {
            $ionicLoading.show({
                template: '<p>Checking...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });

            var appleVersion = "";
            var androidVersion = "";
            console.log("Running on " + ionic.Platform.platform());
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            var isWebView = ionic.Platform.isWebView();

            if (isIOS) {
                appleVersion = CONSTANTS.VERSION;
            } else if (isAndroid) {
                androidVersion = CONSTANTS.VERSION;
            } else {
                androidVersion = CONSTANTS.VERSION;
            }
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    appleVersion: appleVersion,
                    androidVersion: androidVersion,
                    username: localStorage.getItem("username"),
                    password: $scope.input.password
                }
            }).then(function successCallback(response) {
                    $http({
                        url: CONSTANTS.API_URL + "cyclist/account/updatePassword",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            token: localStorage.getItem("token"),
                            password: $scope.input.newPassword
                        }
                    }).then(function successCallback(response) {
                            $ionicLoading.hide();
                            $scope.showAlertPWSuccess();
                        },
                        function errorCallback(response) {
                            $ionicLoading.hide();
                        });
                },
                function errorCallback(response) {
                    $ionicLoading.hide();
                    $scope.showAlertPWMismatch();
                });
        }
    }

    $scope.showAlertPWMismatch = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Old Password Mismatch',
            template: 'The old password you entered did not match our records. Please try again.'
        });

        alertPopup.then(function(res) {

        });
    };

    $scope.showAlertPWShort = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'New Password Too Short',
            template: 'Please ensure that your new password is at least 8 character long and try again.'
        });

        alertPopup.then(function(res) {});
    };

    $scope.showAlertPWSuccess = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Password Changed',
            template: 'Your password has been changed successfully. Please log in with your new password.'
        });

        alertPopup.then(function(res) {
            $ionicLoading.show({
                template: '<p>Logging Out...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });

            $timeout(function() {
                $window.localStorage.clear();
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('login');
            }, 30);
        });
    };
})
