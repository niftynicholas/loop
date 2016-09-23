angular.module('app.main.controllers')

.controller('loadingCtrl', function($scope, /*homeData,*/ mapData, $http, $state, $ionicLoading, $timeout) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Loading Resources...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        })
    }

    $scope.hide = function() {
        $ionicLoading.hide();
    };

    //Removal of token
    $scope.getMapData = function() {
        $http({
            url: 'https://sgcycling-sgloop.rhcloud.com/api/cyclist/map/getMapData',
            method: 'POST',
            async: false,
            headers: {
                'Content-Type': 'application/json'
            }//,
            //data: {
            //    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsInBlcm1pc3Npb25zIjpbInVzZXIiXSwiaWF0IjoxNDczMDk1NzcxfQ.uSS4fWPI8ssAbekZh5foyPAx-oR-oCnGhstOAAIcWVU'
            //},
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
        $state.go('landing');
    }, 4000);
    //$scope.getHomeData();
    $scope.getMapData();
})
