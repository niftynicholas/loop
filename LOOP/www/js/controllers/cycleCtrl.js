angular.module('app.main.controllers')

.controller('cycleCtrl', function($scope, $state, leafletData, dataShare, $ionicHistory, $timeout) {
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
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true,
            minZoom: 11,
            maxZoom: 20
        }
    });

    leafletData.getMap("cycle").then(function(map) {
        // var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        //     attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
        //     //edgeBufferTiles: 2
        //     //subdomains: ['a', 'b', 'c'],
        //     //buffer: 8
        // }).addTo(map);
        setInterval(function() {
            map.invalidateSize();
        }, 3000); //every 3s
        map.locate({
            watch: true,
            enableHighAccuracy: false
        });
        map.on('locationfound', function(e) {
            $scope.currentLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            if ($scope.firstLoad) {
                map.setView($scope.currentLocation, 16);
                $scope.firstLoad = false;
            }
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
            $scope.timestamp = e.timestamp;
        });
        map.on('locationerror', function(e) {
            console.log('Location access denied.');
        });

        /* KML LAYER
        var kmlLayer = omnivore.kml("js/Park_Connector_Loop.kml").addTo(map);
        var style = {
            color: 'black'
        };
        var style2 = {
            color: 'green'
        };
        console.log(kmlLayer);
        console.log(kmlLayer._layers);
        console.log(kmlLayer.getLayerId(0));

        kmlLayer.on('ready', function(layer) {
            var count = 0;
            this.eachLayer(function(layer) {
                count = count + 1;
                if (count % 2 == 0) {
                    layer.setStyle(style);
                } else {
                    layer.setStyle(style2);
                }

            });
        });*/
    });

    $scope.startActivity = function() {
        var data = {
            currentLocation: $scope.currentLocation,
            time: $scope.timestamp
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
        leafletData.getMap("cycle").then(function(map) {
            map.setView($scope.currentLocation);
        });
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
