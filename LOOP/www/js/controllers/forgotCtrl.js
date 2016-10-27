angular.module('app.main.controllers')

.controller('forgotCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, CONSTANTS, dataShare, shareUsername) {
    $scope.input = {};
    // Need to prevent empty string and improper email address format
    // No way to verify resetting of password
    $scope.getQns = function(form) {
        if (form.$valid) {
            $ionicLoading.show({
                template: '<p>Retrieving...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
            });
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/retrieveSecurityQuestions",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: $scope.input.username
                }
            }).then(function successCallback(response) {
                $ionicLoading.hide();
                shareUsername.sendData($scope.input.username);
                dataShare.sendData(response.data.securityQuestions);
                $state.go("answer");
            }, function errorCallback(response) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Retrieval Failed',
                    template: 'The username you entered is not registered.'
                });
                alertPopup.then(function(res) {});
            });
        }
    }
})
