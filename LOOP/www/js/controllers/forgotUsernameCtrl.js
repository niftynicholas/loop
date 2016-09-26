angular.module('app.main.controllers')

.controller('forgotUsernameCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading) {
    $scope.input = {};
    // Need to prevent empty string and improper email address format
    // No way to verify resetting of password
    $scope.sendUsername = function(form) {
        if (form.$valid) {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/forgotUsername",
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
                    title: 'Retrieval Success',
                    template: 'We have sent your username to your email. Be sure to check your junk or spam folder.'
                });

                alertPopup.then(function(res) {
                    $state.go('login');
                });
            }, function errorCallback(response) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Retrieval Failed',
                    template: 'The email you entered has not been registered.'
                });

                alertPopup.then(function(res) {

                });
            });
        }
    }
})
