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
        $scope.hide();
        var login_state = localStorage.getItem('login_state');
        if (login_state === 'true') {
            $state.go('tabsController.home');
        } else {
            $state.go('landing');
        }
    }, 4000);
    $scope.getMapData();
    $scope.getSecurityQnsData();
})
