angular.module('app.main.controllers')

.controller('forgotCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading) {
    $scope.input = {};
    // Need to prevent empty string and improper email address format
    // No way to verify resetting of password
    $scope.sendResetEmail = function(form) {
        if (form.$valid) {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/sendResetPasswordEmail",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    email: $scope.input.email
                }
            }).then(function successCallback(response) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Reset Success',
                    template: 'We have sent your new password to your email. Be sure to check your junk or spam folder.'
                });

                alertPopup.then(function(res) {
                    $state.go('login');
                });
            }, function errorCallback(response) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Reset Failed',
                    template: 'The email you entered has not been registered.'
                });

                alertPopup.then(function(res) {

                });
            });
        }
    }

    $scope.getQns = function(form) {
        if (form.$valid) {
            $state.go("answer");
        }
    }
})
