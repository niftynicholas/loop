angular.module('app.main.controllers')

.controller('loginCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Logging In...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.authorization = {};
    $scope.login = function(form) {
        if (form.$valid) {
            $scope.show();
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/account/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: $scope.authorization.username,
                    password: $scope.authorization.password
                }
            }).then(function successCallback(response) {
                    console.log(response.data);
                    localStorage.setItem("login_state", "true");
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("dateOfBirth", response.data.dateOfBirth);
                    localStorage.setItem("email", response.data.email);
                    localStorage.setItem("height", response.data.height);
                    localStorage.setItem("name", response.data.name);
                    localStorage.setItem("username", response.data.username);
                    localStorage.setItem("weight", response.data.weight);
                    localStorage.setItem("gender", response.data.gender);
                    localStorage.setItem("profilePicture", response.data.profilePicture);
                    console.log(localStorage.getItem("profilePicture"));
                    $scope.hide();
                    $state.go('tabsController.home');
                },
                function errorCallback(response) {
                    $scope.hide();
                    $scope.showAlert();
                });
        }
    }

    // Invalid username/password
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Login Failed',
            template: 'Invalid username or password. Please try again.'
        });

        alertPopup.then(function(res) {

        });
    };
})
