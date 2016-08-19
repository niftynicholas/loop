angular.module('app.main.controllers')

.controller('forgotCtrl', function($scope, $state, $http) {
    $scope.input = {};
    // Need to prevent empty string and improper email address format
    // No way to verify resetting of password
    $scope.sendResetEmail = function() {
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/users/accounts/sendResetPasswordEmail",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                emailAddress: $scope.input.emailAddress
            }
        }).then(function successCallback(response) {
            $state.go('login');
        }, function errorCallback(response) {
            alert("Email Address Not Found");
        });
    }
})
