angular.module('app.main.controllers')

.controller('loginCtrl', function($scope, $ionicLoading, $state, $http, $ionicPopup, CONSTANTS, shareUsername, sharePassword, shareToken) {
    ionic.Platform.ready(function() {
        // will execute when device is ready, or immediately if the device is already ready.
    });

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
            var appleVersion = "";
            var androidVersion = "";
            console.log("Running on " + ionic.Platform.platform());
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            var isWebView = ionic.Platform.isWebView();

            if (isIOS) {
                appleVersion = CONSTANTS.VERSION;
            } else if (isAndroid) {
                androidVersion = CONSTANTS.VERSION;
            } else {
                androidVersion = CONSTANTS.VERSION;
            }
            $http({
                url: CONSTANTS.API_URL + "cyclist/account/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    appleVersion: appleVersion,
                    androidVersion: androidVersion,
                    username: $scope.authorization.username,
                    password: $scope.authorization.password
                }
            }).then(function successCallback(response) {
                console.log(response.data);
                    if (response.status == 203) {
                        $scope.hide();

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Update Profile',
                            template: 'You are required to update your profile before logging in. Do you wish to proceed?'
                        });

                        confirmPopup.then(function(res) {
                            if (res) {
                                shareToken.sendData(response.data.token);
                                shareUsername.sendData($scope.authorization.username);
                                sharePassword.sendData($scope.authorization.password);
                                $state.go("updateProfile");
                            } else {

                            }
                        });
                    } else {
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
                    }
                },
                function errorCallback(response) {
                    $scope.hide();
                    if (response.status == 406) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login Failed',
                            template: 'Invalid username or password. Please try again.'
                        });

                        alertPopup.then(function(res) {

                        });
                    } else if (response.status == 409) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login Failed',
                            template: 'Please update LOOP to the lastest version to enjoy all the features. Thank you.'
                        });

                        alertPopup.then(function(res) {

                        });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login Failed',
                            template: 'Sorry. Something went wrong with the server. Please try again later.'
                        });

                        alertPopup.then(function(res) {

                        });
                    }
                });
        }
    }
})
