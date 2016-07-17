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

.controller('routesCtrl', function($scope) {

})

.controller('cycleCtrl', function($scope, $state, leafletData) {
    leafletData.getMap("cycle").then(function(map) {
        map.locate({
            setView: true,
            watch: true,
            enableHighAccuracy: false
        });
        map.on('locationfound', function(e) {
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
        });
        map.on('locationerror', function(e) {
            alert("Location access denied.");
        });
        /* Geocoder (old version) search box, not very good
        var osmGeocoder = new L.Control.OSMGeocoder({
              collapsed: false,
              position: 'bottomright',
              text: 'Search',
        });
        osmGeocoder.addTo(map);*/

        /* Routing Codes (Old Version)
        L.Routing.control({
            waypoints: [
                L.latLng(1.3521, 103.8198),
                L.latLng(1.2997810230344622, 103.90907790873663)
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map);
        */

        //var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        //var track = new L.KML("js/Park_Connector_Loop.kml", {async: true});
        //track.on("loaded", function(e) { map.fitBounds(e.target.getBounds()); });
        //map.addLayer(track);
        // map.addLayer(osm);
        //map.addControl(new L.Control.Layers({}, {'Park Connector Loop':track}));
        //var kmlLayer = omnivore.kml("js/Park_Connector_Loop.kml").addTo(map);
    });

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        /*
        layers: {
            baselayers: { //hidden baselayer
                xyz: {
                    name: 'Open Cycle Map',
                    url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    type: 'xyz',
                    layerOptions: {
                        showOnSelector: false
                    }
                }
            },
            overlays: {
                wms: {
                    name: 'EEUU States (WMS)',
                    type: 'wms',
                    visible: true,
                    url: 'http://suite.opengeo.org/geoserver/usa/wms',
                    layerParams: {
                        layers: 'usa:states',
                        format: 'image/png',
                        transparent: true
                    }
                }
            }
        },*/
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
        /*    Adding markers
        markers: {
            osloMarker: {
              lat: 1.3521,
              lng: 103.8198,
              focus: true,
              draggable: false
            }
            currentLocation: {
                lat: 1.3521,
                lng: 103.8198,
                message: "current position",
                focus: false,
                draggable: false
            },
            markerTwo: {
                lat: 1.3421,
                lng: 103.8298,
                message: "Marker Two",
                focus: true,
                draggable: true
            }
        },*/
        /*    Drawing Arrow in Leaflet
        decorations: {
            markers: {
                coordinates: [[1.3521, 103.8100], [1.3521, 103.8200]],
                patterns: [
                        {
                            offset: '10%',
                            repeat: 0,
                            symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } })
                        }
                ]
            }
        },*/
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

    $scope.startActivity = function () {
        leafletData.getMap("cycle").then(function (map) {
            map.stopLocate();
        });
        $state.go("inprogress");
    }
    
    /*
     $http({
      url: user.update_path,
      method: "POST",
      headers: {
               'Content-Type': undefined
            },
      data: {user_id: user.id, draft: true}
     });
    
    $scope.dbConnect = function() {
        $http({
            method: 'GET',
            url: 'http://backendpgsql-ywk93.rhcloud.com/main', //?firstname=ong
            params: {
                firstname: 'ong'
            }
        }).then(function successCallback(response) {
            var test = response.data;
            for (var properties in test) {
                alert(properties); //prints the properties
                alert(test[properties]); //prints the value
            }
            //****Accessing Individual Properties****
            //alert(test["firstName"]);
            //alert(test.firstName);
            //***************************************

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.locate = function() {
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            $scope.center.lat = position.coords.latitude;
            $scope.center.lng = position.coords.longitude;
            $scope.center.zoom = 17;
            alert($scope.center.lat + '   ' + $scope.center.lng)
        }, function(err) {
            console.log(err)
        });
    };*/

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

.controller('inprogressCtrl', function ($scope, $state, $ionicPopup, $timeout, leafletData, dataShare) {
    $scope.distance = 0;
    $scope.currentSpeed = 0;
    $scope.averageSpeed = 0;
    $scope.calories = 0;
    $scope.duration = 0;    //In seconds
    $scope.MET = 8;         //FINAL variable to be determined by activity type
    //$scope.age = 25;      //To be retrieve from database
    //$scope.gender = 'M';  //To be retrieve from database
    $scope.weight = 60.0;   //To be retrieve from database

    $scope.timerRunning = true;

    leafletData.getMap("inprogress").then(function (map) {
        map.locate({
            setView: true,
            watch: true,
            enableHighAccuracy: false
        });
        map.on('locationfound', function (e) {

            //*********************************
            //Storing information about Coordinates
            //*********************************

            //$scope.markers.currentLocation.lat = e.latlng.lat;
            //$scope.markers.currentLocation.lng = e.latlng.lng;
            //$scope.markers.currentLocation.message = "current position";
            //$scope.markers.currentLocation.focus = true;
            //$scope.markers.currentLocation.lng = e.latlng.lng
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
            $scope.$on('timer-tick', function (event, data) {
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
            = [(Age x 0.2017) — (Weight x 0.09036) + (Heart Rate x 0.6309) — 55.0969] x Minutes / 4.184

            Women
            = [(Age x 0.074) — (Weight x 0.05741) + (Heart Rate x 0.4472) — 20.4022] x Minutes / 4.184
            *****************************************
            */
            //alert("next GPS Ping");
        });
    });

    $scope.end = function () {
        leafletData.getMap().then(function (map) {
            map.stopLocate();
            alert($scope.paths.toGEOJson);
            alert($scope.paths.toGEOJson.type);
            alert($scope.paths.toGEOJson.coordinates);
            //var firstCoord = $scope.paths.p1.coordinates[0];
            //var lastPosition = $scope.paths.p1.coordinates.length - 1;
            //var lastCoord = $scope.paths.p1.coordinates[lastPosition];
            //alert("lat: " + firstCoord["lat"] + " | " + "lng: " + firstCoord["lng"]);
            //alert("lat: " + lastCoord["lat"] + " | " + "lng: " + lastCoord["lng"]);
            var coords = $scope.paths.p1.coordinates;
            var calculate = geolib.getPathLength($scope.paths.p1.latlngs);
            var totalElevation = 0;
            var avgElevation = 0;
            for (var i = 0; i < coords.length; i++) {
                var coord = coords[i];
                totalElevation += coord["alt"];
            }
            avgElevation = totalElevation / coords.length;
            alert("average elevation is: " + avgElevation);
            alert("Total Cycle Distance: " + calculate + "m");
            alert($scope.paths.p1.coordinates); //an array of hashtable [{ lat : 1.3, lng : 1.11111, alt: 123, time:1323232321 }, { lat : 1.3, lng : 1.11111, alt: 123, time:1323232321  }]
            alert("You have ended your cycle!");
        });
    };

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

    $scope.showConfirm = function () {
        leafletData.getMap().then(function (map) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Stop Activity',
                template: 'Are you sure you want to stop this activity?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    map.stopLocate();
                    console.log('Confirmed');
                    var data = {
                        distance: $scope.distance,
                        duration: $scope.duration,
                        averageSpeed: $scope.averageSpeed,
                        calories: $scope.calories,
                        path: $scope.paths.p1.coordinates
                    };
                    dataShare.sendData(data); //pass as JS object
                    $state.go('completed');
                } else {
                    console.log('Cancelled');
                }
            });
        });
    };

})

.controller('completedCtrl', function ($scope, $state, $ionicPopup, $timeout, leafletData, dataShare) {
    var data = dataShare.getData();
    $scope.distance = data.distance;
    $scope.duration = data.duration;
    $scope.averageSpeed = data.averageSpeed;
    $scope.calories = data.calories;

    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

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
            }
        }
    });

    $scope.paths.p1.latlngs = data.path;

    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Discard Activity',
            template: 'Are you sure you want to eat discard this activity?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure');
                $state.go('tabsController.cycle');
            } else {
                console.log('You are not sure');
            }
        });
    };

})

.controller('freeRouteCtrl', function($scope) {

})

.controller('findRouteCtrl', function($scope) {

})

.controller('planRouteCtrl', function($scope) {

})

.controller('profileCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {
    $scope.height = "165 cm";
    $scope.weight = "50 kg";
})
