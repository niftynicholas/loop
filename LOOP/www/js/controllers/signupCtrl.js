angular.module('app.main.controllers')

.controller('signupCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.input = {};

    $scope.signup = function(form) {
        if (form.$valid) {
            $scope.show();
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/signup",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: $scope.input.username,
                    password: $scope.input.password,
                    name: $scope.input.name,
                    email: $scope.input.email,
                    dateTimeStamp: new Date().getTime()
                }
            }).then(function successCallback(response) {
                $scope.hide();
                $state.go('verify');
            }, function errorCallback(response) {
                console.log(JSON.stringify(response, null, 4));
                $scope.hide();
                $scope.showAlert();
            });
        }
    }

    // Invalid Sign Up Details
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Sign Up Failed',
            template: 'You have provided invalid details. Please try again.'
        });

        alertPopup.then(function(res) {

        });
    };
})
