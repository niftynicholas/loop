angular.module('app.main.controllers')

.controller('loadingCtrl', function($scope, mapData, securityQnsData, $http, $state, $ionicLoading, $timeout, CONSTANTS) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Loading Resources...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        })
    }

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.getMapData = function() {
        $http({
            url: CONSTANTS.API_URL + 'cyclist/map/getMapData',
            method: 'POST',
            async: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
                mapData.sendData(response.data);
            },
            function errorCallback(response) {

            })
    }

    $scope.getSecurityQnsData = function() {
        $http({
            url: CONSTANTS.API_URL + "cyclist/account/retrieveSecurityQuestions",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {

            }
        }).then(function successCallback(response) {
            securityQnsData.sendData(response.data.securityQuestions);
        }, function errorCallback(response) {

        });
    }

    $scope.show();
    $timeout(function() {
        var login_state = localStorage.getItem('login_state');
        if (login_state === 'true') {
            var appleVersion = "";
            var androidVersion = "";
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
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password")
                }
            }).then(function successCallback(response) {
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
                    localStorage.setItem("password", localStorage.getItem("password"));
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
                    $state.go('landing');
                });
        } else {
            $scope.hide();
            $state.go('landing');
        }
    }, 3000);
    $.ajax({
        type: "GET",
        dataType: 'json',
        contentType: 'application/json', // This is the money shot
        url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/others/getURL",
        success: function(data) {
            CONSTANTS.API_URL = data.url + "/api/";
            $scope.getMapData();
            $scope.getSecurityQnsData();
            console.log("success " + CONSTANTS.API_URL);
        },
        error: function(data) {
            $scope.getMapData();
            $scope.getSecurityQnsData();
            console.log("error " + CONSTANTS.API_URL);
        }
    })

})
