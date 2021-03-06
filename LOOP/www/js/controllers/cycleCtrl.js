angular.module('app.main.controllers')

.controller('cycleCtrl', function($scope, $state, leafletData, dataShare, $ionicHistory, $timeout, $cordovaGeolocation, sharedRoute) {
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
            maxZoom: 18,
            attributionControl: false
        }
    });
    //To Parameterise edgeBufferTiles / setInterval to Seconds
    leafletData.getMap("cycle").then(function(map) {
        var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
            attribution: '<a href="http://www.opencyclemap.org">© OpenCycleMap</a>',
            edgeBufferTiles: 2
        }).addTo(map);

        var attribution = L.control.attribution({position: 'bottomright'});

        var attributionBtn = L.easyButton({
            id: 'animated-marker-toggle',
            position: 'bottomleft',
            type: 'replace',
            states: [{
                stateName: 'show-attribution',
                icon: 'fa-info',
                title: 'Show Attribution',
                onClick: function(control) {
                    map.addControl(attribution);
                    control.state('hide-attribution');
                }
            }, {
                stateName: 'hide-attribution',
                title: 'Hide Attribution',
                icon: 'fa-times-circle',
                onClick: function(control) {
                    map.removeControl(attribution);
                    control.state('show-attribution');
                }
            }]
        });
        attributionBtn.addTo(map);

        setInterval(function() {
            map.invalidateSize();
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                $scope.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if ($scope.firstLoad) {
                    map.setView($scope.currentLocation, 18);
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
        if (typeof $scope.currentLocation.lat !== "undefined") {
            leafletData.getMap("cycle").then(function(map) {
                map.setView($scope.currentLocation, 18);
            });
        } else {
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, 18);
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
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        // note: the indexes are 0-based
        $scope.activeIndex = data.activeIndex;
        $scope.previousIndex = data.previousIndex;
    });
})
