angular.module('app.main.controllers')

.controller('cycleCtrl', function($scope, $state, leafletData, dataShare, $ionicHistory, $timeout, $cordovaGeolocation) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;
    $scope.timestamp = 0;

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        paths: {
            currentLoc: {
                type: 'circleMarker',
                fillColor: '#4183D7', //DarkSlateGray
                //color: '#000000',
                ///weight: 1,
                opacity: 80,
                fillOpacity: 0.9,
                stroke: false,
                clickable: false,
                latlngs: [0, 0], //1.2997810230344622, 103.90907790873663
                radius: 10
            },
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true,
            minZoom: 11,
            maxZoom: 20
        }
    });
    //To Parameterise edgeBufferTiles / setInterval to Seconds
    leafletData.getMap("cycle").then(function(map) {
        var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
            attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
            edgeBufferTiles: 2
        }).addTo(map);

        setInterval(function() {
            map.invalidateSize();
            $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
                $scope.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if ($scope.firstLoad) {
                    map.setView($scope.currentLocation, 16);
                    $scope.firstLoad = false;
                }
                $scope.paths.currentLoc.latlngs = [];
                $scope.paths.currentLoc.latlngs.push(position.coords.latitude);
                $scope.paths.currentLoc.latlngs.push(position.coords.longitude);
                $scope.timestamp = position.timestamp;
            }, function(err) {
                console.log("Location not found");
            });
        }, 3000); //every 3s
    });

    $scope.startActivity = function() {
        var data = {
            currentLocation: $scope.currentLocation,
            time: $scope.timestamp,
            startDateTimeStamp: new Date().getTime()
        };
        dataShare.clearData();
        dataShare.sendData(data);
        $scope.firstLoad = true;
        $state.go("inprogress");
    }

    $scope.planRoute = function() {
        var data = {
            currentLocation: $scope.currentLocation,
        };
        dataShare.clearData();
        dataShare.sendData(data);
        $state.go("planRoute");
    }

    $scope.locateMe = function() {
        if(typeof $scope.currentLocation.lat !== "undefined"){
            leafletData.getMap("cycle").then(function(map) {
                map.setView($scope.currentLocation);
            });
        }else{
            $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
                map.setView({lat: position.coords.latitude, lng: position.coords.longitude});
            }, function(err) {
                console.log("Location not found");
            });
        }
    }

    $scope.options = {
        loop: false,
        effect: 'slide',
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
})
