angular.module('app.main.controllers')

.controller('loadingCtrl', function($scope, mapData, $http, $state, $ionicLoading, $timeout) {
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
            url: 'https://sgcycling-sgloop.rhcloud.com/api/cyclist/map/getMapData',
            method: 'POST',
            async: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
                mapData.sendData(response.data);
                console.log("Data for Map Tab has been loaded.");
            },
            function errorCallback(response) {

            })
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
})
