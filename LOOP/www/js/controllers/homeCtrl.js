angular.module('app.main.controllers')

.controller('homeCtrl', function($scope, routeName, $state, $http) {
    $scope.routes = {}

    $http({
        url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getNParkRoutes",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            token: localStorage.getItem("token")
        }
    }).then(function successCallback(response) {
            console.log(JSON.stringify(response));
            $scope.routes = response.data.data;
        },
        function errorCallback(response) {
            console.log(JSON.stringify(response));
        })


    $scope.options = {
        loop: true,
        effect: 'slide',
        autoplay: 2200,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
        console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        // note: the indexes are 0-based
        $scope.activeIndex = data.activeIndex;
        $scope.previousIndex = data.previousIndex;
    });

    $scope.viewRoute = function(cid) {
        routeName.sendData(cid);
        console.log(cid);
        $state.go("viewRoute");
    }

    // Hardcoded to Populate Route Name at the Top START
    // $scope.viewRoute1 = function() {
    //     $scope.routeName = document.getElementById("routeName1").textContent;
    //     routeName.sendData($scope.routeName);
    //     console.log($scope.routeName);
    //     $state.go("viewRoute");
    // }
    //
    // $scope.viewRoute2 = function() {
    //     $scope.routeName = document.getElementById("routeName2").textContent;
    //     routeName.sendData($scope.routeName);
    //     console.log($scope.routeName);
    //     $state.go("viewRoute");
    // }
    //
    // $scope.viewRoute3 = function() {
    //     $scope.routeName = document.getElementById("routeName3").textContent;
    //     routeName.sendData($scope.routeName);
    //     console.log($scope.routeName);
    //     $state.go("viewRoute");
    // }
})
