angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, $state, $http) {
    $scope.input = {};
    $scope.login = function() {
        $http({
            url: "http://backendpgsql-ywk93.rhcloud.com/login",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: $scope.input.username,
                password: $scope.input.password
            }
        }).then(function successCallback(response) {
            alert("Success");
            $state.go('tabsController.home');
        }, function errorCallback(response) {
            alert("Error");
        });
    }
})

.controller('signupCtrl', function($scope, $state, $http) {
    $scope.input = {};
    $scope.signUp = function() {
        $http({
            url: 'http://backendpgsql-ywk93.rhcloud.com/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: $scope.input.username,
                password: $scope.input.password,
                height: 0,
                weight: 0
            }
        }).then(function successCallback(response) {
            $state.go('login');
        }, function errorCallback(response) {

        });
    }
})

.controller('homeCtrl', function($scope) {
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
})

.controller('pcnCtrl', function($scope, leafletData) {
    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        tiles: {
            url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q"
        },
        defaults: {
            scrollWheelZoom: false,
            zoomControl: false
        }
    });

    leafletData.getMap("pcn").then(function(map) {
        // var track = new L.KML("js/Park_Connector_Loop.kml", {
        //     async: true
        // });
        // track.on("loaded", function(e) {
        //     map.fitBounds(e.target.getBounds());
        // });
        // map.addLayer(track);
        // map.addControl(new L.Control.Layers({}, {
        //     'Park Connector Network': track
        // }));

        var customLayer = L.geoJson(null, {
            // http://leafletjs.com/reference.html#geojson-style
            style: function(feature) {
                return {
                    color: '#0d5e4e'
                };
            }
        });

        omnivore.kml('js/Park_Connector_Loop.kml', null, customLayer).addTo(map);

        map.addControl(new L.Control.Layers({}, {
            'Park Connector Network': customLayer
        }));
    });
})

.controller('routesCtrl', function($scope) {

})

.controller('selectRouteCtrl', function($scope) {

})

.controller('viewRouteCtrl', function($scope, leafletData) {
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
            scrollWheelZoom: false,
            zoomControl: false
        }
    });

})


.controller('cycleCtrl', function($scope, $state, leafletData) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;
    leafletData.getMap("cycle").then(function(map) {
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
                map.setView($scope.currentLocation, 18);
                $scope.firstLoad = false;
            }
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
        });
        map.on('locationerror', function(e) {
            //            alert("Location access denied.");
            console.log('Location access denied.');
        });


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
        });
    });

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        paths: {
            p1: {
                color: '#008000',
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
        },
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        defaults: {
            scrollWheelZoom: false,
            zoomControl: false
        }
    });

    $scope.startActivity = function() {
        $scope.firstLoad = true;

        leafletData.getMap("inprogress").then(function(map) {
            map.locate({
                setView: true,
                watch: true,
                enableHighAccuracy: false
            });
        });
        $state.go("inprogress");
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

.controller('inprogressCtrl', function($scope, $state, $ionicPopup, $timeout, leafletData, dataShare) {
    $scope.distance = 0;
    $scope.currentSpeed = 0;
    $scope.averageSpeed = 0;
    $scope.calories = 0;
    $scope.duration = 0; //In seconds
    $scope.MET = 8; //FINAL variable to be determined by activity type
    //$scope.age = 25;      //To be retrieve from database
    //$scope.gender = 'M';  //To be retrieve from database
    $scope.weight = 60.0; //To be retrieve from database
    $scope.currentLocation = {};
    var data;

    leafletData.getMap("inprogress").then(function(map) {
        $scope.hasStopped = false;
        $scope.$broadcast('timer-start');
        map.on('locationfound', function(e) {
            if ($scope.hasStopped) {
                $scope.$broadcast('timer-start');
                $scope.hasStopped = false;
            }
            $scope.timerRunning = true;
            $scope.currentLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            //*********************************
            //Storing information about Coordinates
            //*********************************
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
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
            scrollWheelZoom: false,
            zoomControl: false
        },
        paths: {
            p1: {
                color: '#008000',
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
                        duration: $scope.duration,
                        averageSpeed: $scope.averageSpeed,
                        calories: $scope.calories,
                        path: $scope.paths.p1.latlngs
                    };
                    dataShare.sendData(data); //pass as JS object
                    $scope.distance = 0;
                    $scope.currentSpeed = 0;
                    $scope.averageSpeed = 0;
                    $scope.calories = 0;
                    $scope.duration = 0;
                    $scope.paths.p1.coordinates = [];
                    $scope.paths.p1.latlngs = [];
                    $scope.paths.currentLoc.latlngs = [0, 0];
                    $scope.$broadcast('timer-stop');
                    $scope.timerRunning = false;
                    $scope.hasStopped = true;
                    //$scope.$broadcast('timer-reset');
                    $scope.$broadcast('profile-updated', "");
                    $state.go('completed');

                } else {
                    console.log('Cancelled');
                }
            });
        });
    };

})

.controller('completedCtrl', function($scope, $state, $ionicPopup, $timeout, leafletData, dataShare) {
    angular.extend($scope, {
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        bounds: {},
        defaults: {
            scrollWheelZoom: false,
            zoomControl: false
        },
        paths: {
            p1: {
                color: '#008000',
                weight: 8,
                latlngs: [], //{ lat: 51.50, lng: -0.082 }
            }
        }
    });

    //To test Broadcast after doing nested controller
    $scope.$on('profile-updated', function(event, profileObj) {
        alert("Test");

    });


    //$scope.$on('onCompleted', function (events, args) {
    //alert("Test On");
    var data = dataShare.getData();
    $scope.distance = data.distance;
    $scope.duration = data.duration;
    $scope.averageSpeed = data.averageSpeed;
    $scope.calories = data.calories;

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + " " + monthNames[today.getMonth()] + " " + yyyy;

    $scope.today = today;

    $scope.paths.p1.latlngs = data.path;

    leafletData.getMap("completed").then(function(map) {
        map.fitBounds($scope.paths.p1.latlngs);
    });
    //});


    // A confirm dialog
    $scope.discard = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Discard Activity',
            template: 'Are you sure you want to eat discard this activity?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                dataShare.clearData();
                $state.go('tabsController.cycle');
            } else {
                console.log('You are not sure');
            }
        });
    };

    $scope.save = function() {
        dataShare.clearData();
        $state.go('tabsController.cycle');
    };
})

.controller('freeRouteCtrl', function($scope) {

})

.controller('findRouteCtrl', function($scope) {

})

.controller('planRouteCtrl', function($scope, leafletData) {
    $scope.input = {};

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
            scrollWheelZoom: false,
            zoomControl: false
        }
    });


    leafletData.getMap("planRoute").then(function(map) {
        var placeAutoComplete = r360.photonPlaceAutoCompleteControl({
            serviceUrl: "https://service.route360.net/geocode/",
            placeholder: 'Select start!',
            width: 500,
            reset: true,
        });
        // add the controls to the map
        map.addControl(placeAutoComplete);

        // define what happens if someone clicks an item in the autocomplete
        placeAutoComplete.onSelect(function(item) {
            console.log(item);
            console.log(item.latlng);
        });

        // define what happens if someone clicks the reset button
        placeAutoComplete.onReset(function() {
            // remove the label and value from the autocomplete
            placeAutoComplete.reset();
        });
    });

    $scope.planRoute = function() {
        var startPoint = $scope.input.startPoint;
        var endPoint = $scope.input.endPoint;

        if (validStartPoint(startPoint) && validEndPoint(endPoint)) {
            leafletData.getMap("planRoute").then(function(map) {

                //map.locate({
                //     setView: true,
                //});
                var latlons = {
                    src1: [1.301, 103.8198],
                    trg1: [1.331, 103.8197],
                };

                r360.config.serviceKey = 'YWtKiQB7MiZETbCoVsG6'; //00AGI2VAF2HNS37EMMLV
                r360.config.serviceUrl = 'https://service.route360.net/malaysia_singapore/';

                var redIcon = L.icon({
                    iconUrl: 'lib/leaflet-route360/marker-icon-red.png',
                    shadowUrl: 'lib/leaflet-route360/marker-shadow.png',
                    iconAnchor: [12, 45],
                    popupAnchor: [0, -35]
                });

                var sourceMarker1 = L.marker(latlons.src1).addTo(map);
                var targetMarker1 = L.marker(latlons.trg1, {
                    icon: redIcon
                }).addTo(map);

                var routeLayer = L.featureGroup().addTo(map);
                var travelOptions = r360.travelOptions();
                travelOptions.addSource(sourceMarker1);
                travelOptions.addTarget(targetMarker1);
                travelOptions.setTravelType('bike');

                r360.RouteService.getRoutes(travelOptions, function(routes) {
                    _.each(routes, function(route) {
                        r360.LeafletUtil.fadeIn(routeLayer, route, 1000, "travelDistance");
                    });
                });
                console.log(routeLayer);

            });
        } else {
            if (!validStartPoint(startPoint)) {
                alert("Please enter a start Point");
            }
            if (!validEndPoint(endPoint)) {
                alert("Please enter a end Point");
            }
        }
    };
})

.controller('profileCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {
    $scope.height = "165 cm";
    $scope.weight = "50 kg";
})

function validStartPoint(startPoint) {
    var valid = true;
    if (typeof startPoint === "undefined" || startPoint == "") {
        valid = false;
    }
    return valid;
}

function validEndPoint(endPoint) {
    var valid = true;
    if (typeof endPoint === "undefined" || endPoint == "") {
        if (typeof endPoint === "undefined" || endPoint == "") {
            valid = false;
        }
    }
    return valid;
}
