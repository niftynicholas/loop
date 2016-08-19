angular.module('app.main.controllers')

.controller('inprogressCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicModal, leafletData, dataShare, $ionicPlatform, sharedRoute) {
    $scope.distance = 0;
    $scope.currentSpeed = 0;
    $scope.averageSpeed = 0;
    $scope.calories = 0;
    $scope.duration = 0; //In seconds
    $scope.MET = 8; //FINAL variable to be determined by activity type
    //$scope.age = 25;      //To be retrieve from database
    //$scope.gender = 'M';  //To be retrieve from database
    $scope.weight = 60.0; //To be retrieve from database
    var data;

    $scope.options = {
        loop: false,
        autoHeight: true,
        effect: 'slide',
        speed: 500
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

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        paths: {
            p1: {
                color: '#1abc9c',
                weight: 8,
                latlngs: [], //{ lat: 51.50, lng: -0.082 }
                coordinates: [],
            },
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
            toGEOJson: {
                "type": "Point",
                "coordinates": []
            }
        }
    });

    leafletData.getMap("inprogress").then(function(map) {
        if (map.hasLayer(sharedRoute.data)) {
            map.removeLayer(sharedRoute.data);
        }
        map.addLayer(sharedRoute.data);
        if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
            //Pass currentLocation from cycle.html
            var data = dataShare.getData();
            $scope.currentLocation = data.currentLocation;
            var currentlat = $scope.currentLocation.lat;
            var currentlng = $scope.currentLocation.lng;
            $scope.paths.currentLoc.latlngs = [currentlat, currentlng];

            $scope.paths.p1.latlngs.push({
                lat: currentlat,
                lng: currentlng
            });
            $scope.paths.p1.coordinates.push({ //storing each coordinate information
                lat: currentlat,
                lng: currentlng,
                //alt: e.altitude,
                time: data.time
            });
            $scope.paths.toGEOJson.coordinates.push([currentlat, currentlng]);

            map.setView($scope.currentLocation, 18);
            dataShare.clearData();
        }
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;

        map.on('locationfound', function(e) {
            $scope.timerRunning = true;
            $scope.currentLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            //*********************************
            //Storing information about Coordinates
            //*********************************
            $scope.paths.currentLoc.latlngs = [e.latlng.lat, e.latlng.lng];
            $scope.paths.p1.latlngs.push({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
            $scope.paths.p1.coordinates.push({ //storing each coordinate information
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                //alt: e.altitude,
                time: e.timestamp
            });
            $scope.paths.toGEOJson.coordinates.push([e.latlng.lat, e.latlng.lng]);

            //*********************************
            //Start to calculate metrics
            //*********************************
            $scope.distance = geolib.getPathLength($scope.paths.p1.latlngs) / 1000.0;

            var coordinates = $scope.paths.p1.coordinates;
            if (coordinates.length > 1) {
                var latestCoord = coordinates[coordinates.length - 1];
                var secondLatestCoord = coordinates[coordinates.length - 2];
                var curSpd = geolib.getSpeed(secondLatestCoord, latestCoord);
                $scope.currentSpeed = (Math.round(curSpd * 100) / 100);
            }
            $scope.timerRunning = false;
            $scope.$on('timer-tick', function(event, data) {
                if ($scope.timerRunning === false) {
                    $scope.duration = data.millis / 1000.0;
                    var avgSpd = $scope.distance / ($scope.duration / 3600.0);
                    $scope.averageSpeed = (Math.round(avgSpd * 100) / 100);
                }
                $scope.timerRunning = true;
            });

            var calories = $scope.weight * $scope.MET * ($scope.duration / 3600.0);
            $scope.calories = (Math.round(calories * 100) / 100);
            /*
            ***************GENERIC*******************
            Calories Burned = Weight X MET X Hour
            *****************************************

            **************GENDER SPECIFIC************
            var avgCyclingHeartRate = (220 - $scope.age) * 0.7;
            Men
            = [(Age x 0.2017) � (Weight x 0.09036) + (Heart Rate x 0.6309) � 55.0969] x Minutes / 4.184

            Women
            = [(Age x 0.074) � (Weight x 0.05741) + (Heart Rate x 0.4472) � 20.4022] x Minutes / 4.184
            *****************************************
            */
            //alert("next GPS Ping");
        });
    });

    $scope.locateMe = function() {
        leafletData.getMap("inprogress").then(function(map) {
            map.setView($scope.currentLocation);
        });
    }

    $scope.showConfirm = function() {
        leafletData.getMap("inprogress").then(function(map) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Stop Activity',
                template: 'Are you sure you want to stop this activity?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    map.stopLocate();
                    console.log('Confirmed');
                    data = {
                        distance: $scope.distance,
                        duration: moment().startOf('year').seconds($scope.duration).format('HH:mm:ss'), //moment().startOf('year').seconds(40888).format('HH:mm:ss')
                        averageSpeed: $scope.averageSpeed,
                        calories: $scope.calories,
                        path: $scope.paths.p1.latlngs
                    };
                    dataShare.sendData(data); //pass as JS object
                    //$scope.distance = 0;
                    //$scope.currentSpeed = 0;
                    //$scope.averageSpeed = 0;
                    //$scope.calories = 0;
                    //$scope.duration = 0;
                    //$scope.paths.p1.coordinates = [];
                    //$scope.paths.p1.latlngs = [];
                    //$scope.paths.currentLoc.latlngs = [0, 0];
                    $scope.$broadcast('timer-stop');
                    $scope.timerRunning = false;
                    //$scope.$broadcast('timer-reset');
                    $state.go('completed');

                } else {
                    console.log('Cancelled');
                }
            });
        });
    };

    $scope.geotag = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.geotag">',
            title: "What's going on here?",
            subTitle: 'Share it with other users.',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.geotag) {
                        //don't allow the user to close unless he enters wifi password

                    } else {
                        return $scope.data.geotag;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
    };

    // prevent backbutton
    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
        function() {
            $scope.showCancel();
        }, 100
    );
    $scope.$on('$destroy', deregisterSecond);

    // Back button triggered: cancel
    $scope.showCancel = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Discard Activity',
            template: 'Are you sure you want to stop and discard this activity?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                $state.go("tabsController.cycle")

            } else {
                console.log('You are not sure');
            }
        });
    };
})
