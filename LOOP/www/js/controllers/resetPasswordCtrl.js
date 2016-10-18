angular.module('app.main.controllers')

.controller('resetPasswordCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http) {
    $scope.type = "password";

    $scope.toggleVisibility = function() {
        if ($scope.type == "password") {
            $scope.type = "text";
        } else if ($scope.type == "text") {
            $scope.type = "password";
        }
    }
    $scope.reset =function(form) {
        if (form.$valid) {
            $state.go("login");
        }
    }
})
