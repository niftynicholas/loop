angular.module('app.main.controllers')

.controller('homeCtrl', function($scope, routeName, $state) {
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

    // Hardcoded to Populate Route Name at the Top START
    $scope.viewRoute1 = function() {
        $scope.routeName = document.getElementById("routeName1").textContent;
        routeName.sendData($scope.routeName);
        console.log($scope.routeName);
        $state.go("viewRoute");
    }

    $scope.viewRoute2 = function() {
        $scope.routeName = document.getElementById("routeName2").textContent;
        routeName.sendData($scope.routeName);
        console.log($scope.routeName);
        $state.go("viewRoute");
    }

    $scope.viewRoute3 = function() {
        $scope.routeName = document.getElementById("routeName3").textContent;
        routeName.sendData($scope.routeName);
        console.log($scope.routeName);
        $state.go("viewRoute");
    }
})
