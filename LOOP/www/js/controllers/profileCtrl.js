angular.module('app.main.controllers')

.controller('profileCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicHistory, $window) {
    //console.log("reading height and weight in the profile page");
    //console.log("height is now " + localStorage.getItem("height"));
    $scope.height = parseFloat(localStorage.getItem("height"));
    if (isNaN($scope.height)) {
        $scope.height = 0;
    }
    $scope.weight = parseFloat(localStorage.getItem("weight"));
    if (isNaN($scope.weight)) {
        $scope.weight = 0;
    }
    $scope.name = localStorage.getItem("name");

    $scope.logOut = function() {
        $ionicLoading.show({
            template: '<p>Logging Out...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
        localStorage.setItem('loggin_state', 'false');

        $timeout(function() {
            $window.localStorage.clear();
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });
            $state.go('login');
        }, 30);
    }
})
