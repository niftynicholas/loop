angular.module('app.main.controllers')

.controller('answerCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Verifying...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.answer = function(form) {
        if (form.$valid) {
            $state.go("resetPassword");
        }
    }


})
