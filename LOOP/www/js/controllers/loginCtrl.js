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
                    localStorage.setItem("login_state", "true");
                    localStorage.setItem("token", response.data.user.token);
                    localStorage.setItem("dateOfBirth", response.data.user.dateOfBirth);
                    localStorage.setItem("email", response.data.user.email);
                    localStorage.setItem("height", response.data.user.height);
                    localStorage.setItem("name", response.data.user.name);
                    localStorage.setItem("username", response.data.user.username);
                    localStorage.setItem("weight", response.data.user.weight);
                    localStorage.setItem("gender", response.data.user.gender);
                    localStorage.setItem("uid", response.data.user.uid);
                    localStorage.setItem("numActivities", response.data.user.numActivities);
                    localStorage.setItem("totalCalories", response.data.user.totalCalories);
                    localStorage.setItem("avgCalories", response.data.user.avgCalories);
                    //Stores the top 5 popular routes
                    localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                    //Stores the top 5 bookmarked Routes
                    localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                    //Stores the top profilePictures
                    localStorage.setItem("profilePictures", JSON.stringify(response.data.profilePictures));
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
