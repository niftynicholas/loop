angular.module('app.main.controllers')

.controller('loginCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup, CONSTANTS) {
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
                url: CONSTANTS.API_URL + "cyclist/account/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    version: CONSTANTS.VERSION,
                    username: $scope.authorization.username,
                    password: $scope.authorization.password
                }
            }).then(function successCallback(response) {
                    console.log(response.data);
                    localStorage.setItem("login_state", "true");
                    localStorage.setItem("avatar", response.data.user.avatar);
                    localStorage.setItem("avgCalories", response.data.user.avgCalories);
                    localStorage.setItem("dateOfBirth", response.data.user.dateOfBirth);
                    localStorage.setItem("gender", response.data.user.gender);
                    localStorage.setItem("height", response.data.user.height);
                    localStorage.setItem("numActivities", response.data.user.numActivities);
                    localStorage.setItem("token", response.data.user.token);
                    localStorage.setItem("totalCalories", response.data.user.totalCalories);
                    localStorage.setItem("username", response.data.user.username);
                    localStorage.setItem("weight", response.data.user.weight);
                    localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                    localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                    localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                    localStorage.setItem("geotagCategories", JSON.stringify(response.data.geotagCategories));
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
