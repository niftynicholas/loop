angular.module('app.main.controllers')

.controller('changePasswordCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $window) {
    $scope.input = {};
    $scope.changePW = function(form) {
        if (form.$valid) {
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: localStorage.getItem("username"),
                    password: $scope.input.password
                }
            }).then(function successCallback(response) {
                    if ($scope.input.newPassword.length >= 8) {
                        $http({
                            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/updatePassword",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                token: localStorage.getItem("token"),
                                password: $scope.input.newPassword
                            }
                        }).then(function successCallback(response) {
                                console.log(response);
                                $scope.showAlertPWSuccess();
                            },
                            function errorCallback(response) {
                                console.log("Error in updating password.");
                            });
                    } else {
                        $scope.showAlertPWShort();
                    }
                },
                function errorCallback(response) {
                    $scope.showAlertPWMismatch();
                });
        }
    }

    $scope.showAlertPWMismatch = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Old Password Mismatch',
            template: 'The Old Password you entered did not match our records. Please try again.'
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
