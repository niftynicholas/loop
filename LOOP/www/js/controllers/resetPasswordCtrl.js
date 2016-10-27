angular.module('app.main.controllers')

.controller('resetPasswordCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http, dataShare, CONSTANTS) {
    $scope.type = "password";

    $scope.input = {};

    $scope.toggleVisibility = function() {
        if ($scope.type == "password") {
            $scope.type = "text";
        } else if ($scope.type == "text") {
            $scope.type = "password";
        }
    }

    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Changing...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.reset = function(form) {
        if (form.$valid) {
            $scope.show();
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/updatePassword",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: dataShare.getData(),
                    password: $scope.input.password
                }
            }).then(function successCallback(response) {
                $scope.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Success!',
                    template: 'Your account password has been changed. You may proceed to login now.'
                });

                alertPopup.then(function(res) {
                    $state.go("login");
                });
            }, function errorCallback(response) {
                $scope.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Opps!',
                    template: 'We are unable to reset your password due to server issues. Please try again later.'
                });

                alertPopup.then(function(res) {

                });
            });
        }
    }
})
