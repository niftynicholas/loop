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


.controller('cycleCtrl', function ($scope, $state, leafletData, dataShare) {
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
            $scope.timestamp = e.timestamp;
        });
        map.on('locationerror', function(e) {
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

    $scope.startActivity = function () {
        var data = {
            currentLocation: $scope.currentLocation,
            time: $scope.timestamp
        };
        dataShare.sendData(data);
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

.controller('inprogressCtrl', function ($scope, $state, $ionicPopup, $timeout, $ionicModal, leafletData, dataShare) {
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

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
        console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
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

    leafletData.getMap("inprogress").then(function (map) {
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

        map.on('locationfound', function (e) {
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


    /**
     * Confirm Dialog
     */
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

    /**
     * Save Button
     */
    $scope.save = function() {
        dataShare.clearData();
        $state.go('tabsController.cycle');
    };

})

.controller('freeRouteCtrl', function($scope) {

})

.controller('findRouteCtrl', function($scope) {

})

.controller('planRouteCtrl', function($scope, leafletData, $http) {
    var token = "";
    var searchLimit = 10; //10 or more because has digit 0 to 9 for last digit in postal code

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

    /**
     * Ajax call to get token from OneMap
     */
    $.ajax({
        dataType: 'json',
        url: 'http://www.onemap.sg/API/services.svc/getToken',
        async: false,
        data: {
            'accessKEY': '2WpSB38gVk6Shp1NiEgk0eTAHRsv4jGu7cs4N1r8KipyJJyB7uN8+hl3LXNq2iX1c/wdJhIStL4a6kEacP8CT/HQfXmkWp25|mv73ZvjFcSo=',
        },
        success: function (data) {
            token = data.GetToken[0].NewToken;
            console.log(token);
        }
    });

    if (typeof(token) == "undefined"){
        token = 'xkg8VRu6Ol+gMH+SUamkRIEB7fKzhwMvfMo/2U8UJcFhdvR4yN1GutmUIA3A6r3LDhot215OVVkZvNRzjl28TNUZgYFSswOi';
    }

    /**
     * Populate Search Results for Start Point
     */
    $('#startPoint').keyup(function() {
        var input = $('#startPoint').val(),
            type = 'WGS84';
        var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
        $.getJSON(requestURL, {
            'token': token,
            'searchVal': input,
            'projSys': type,
        }, function(data) {
            $('#startResult').html("");
            //If data is length > 2 means there are multiple results
            if (data.SearchResults.length > 2) {
                var toLoopTill = searchLimit;
                if (data.SearchResults.length < 11) {
                    //if results were lesser than current searchLimit set
                    toLoopTill = data.SearchResults.length - 1;
                }
                for (var i = 1; i <= toLoopTill; i++) {
                    var searchVal = data.SearchResults[i].SEARCHVAL;
                    var lat = data.SearchResults[i].Y;
                    var lng = data.SearchResults[i].X;
                    if (searchVal != null) {
                        //Populate the results in the startResult div
                        $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\')">' + searchVal + '</div>');
                    }

                }
            } else if (data.SearchResults.length == 2) {
                //If data length == 2 means there is only 1 result
                $('#startPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
            } else {
                //No results were found
                $('#startResult').html("");
                $('#startPoint').removeAttr("data-latlng");
            }
        });
    });

    /**
     * Populate Search Results for End Point
     */
    $('#endPoint').keyup(function() {
        var input = $('#endPoint').val(),
            type = 'WGS84';
        var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
        $.getJSON(requestURL, {
            'token': token,
            'searchVal': input,
            'projSys': type,
        }, function(data) {
            $('#endResult').html("");
            //If data is length > 2 means there are multiple results
            if (data.SearchResults.length > 2) {
                var toLoopTill = searchLimit;
                if (data.SearchResults.length < 11) {
                    //if results were lesser than current searchLimit set
                    toLoopTill = data.SearchResults.length - 1;
                }
                for (var i = 1; i <= toLoopTill; i++) {
                    var searchVal = data.SearchResults[i].SEARCHVAL;
                    var lat = data.SearchResults[i].Y;
                    var lng = data.SearchResults[i].X;
                    if (searchVal != null) {
                        //Populate the results in the endResult div
                        $('#endResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'end\')">' + searchVal + '</div>');
                    }

                }
            } else if (data.SearchResults.length == 2) {
                //If data length == 2 means there is only 1 result
                $('#endPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
            } else {
                //No results were found
                $('#endResult').html("");
                $('#endPoint').removeAttr("data-latlng");
            }
        });
    });

    /**
     * Calculate Route based on Start & End Points
     */
    $scope.planRoute = function() {
        var startInput = document.getElementById("startPoint");
        var endInput = document.getElementById("endPoint");
        var startLatLng = startInput.getAttribute("data-latlng");
        var endLatLng = endInput.getAttribute("data-latlng");

        if (startLatLng != null && endLatLng != null) {
            leafletData.getMap("planRoute").then(function(map) {

                //LatLng is "lat, lng" after utilising getAttribute so spliting it gives us our array [lat, lng]
                startLatLng = startLatLng.split(",");
                endLatLng = endLatLng.split(",");

                map.eachLayer(function(layer) {
                    if (layer._leaflet_id != 387) {
                        //Clear all layers except tileLayer
                        map.removeLayer(layer);
                    }
                });

                r360.config.serviceKey = '00AGI2VAF2HNS37EMMLV'; //My Key: 00AGI2VAF2HNS37EMMLV         Website Key: YWtKiQB7MiZETbCoVsG6
                r360.config.serviceUrl = 'https://service.route360.net/malaysia_singapore/';

                var redIcon = L.icon({
                    iconUrl: 'lib/leaflet-route360/marker-icon-red.png',
                    shadowUrl: 'lib/leaflet-route360/marker-shadow.png',
                    iconAnchor: [12, 45],
                    popupAnchor: [0, -35]
                });

                var sourceMarker1 = L.marker(startLatLng, {
                    draggable: true
                }).addTo(map);
                var targetMarker1 = L.marker(endLatLng, {
                    draggable: true,
                    icon: redIcon
                }).addTo(map);

                var startPointName = $("#startPoint").val();
                var endPointName = $("#endPoint").val();

                sourceMarker1.bindPopup(startPointName, {
                    closeOnClick: false,
                    autoPan: false
                }).openPopup();

                targetMarker1.bindPopup(endPointName, {
                    closeOnClick: false,
                    autoPan: false
                }).openPopup();

                findRoute(map, sourceMarker1, targetMarker1, startLatLng, endLatLng);

                sourceMarker1.on('dragend', function() {
                    var source = sourceMarker1;
                    var target = targetMarker1;

                    map.eachLayer(function(layer) {
                        if (layer._leaflet_id != 387) { 
                            //Clear all layers except tiles
                            map.removeLayer(layer);
                        }
                    });
                    source.addTo(map);
                    target.addTo(map);

                    $.ajax({
                        dataType: 'json',
                        url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                        data: {
                            'token': token,
                            'location': source.getLatLng().lng + "," + source.getLatLng().lat,
                            'buffer': 0,
                        },
                        success: function (data) {
                            console.log("Start Point");
                            console.log(data);
                            if (data.GeocodeInfo[0].ErrorMessage == "Invalid location") {
                                startPointName = "Location Cannot Be Found";
                            } else {
                                startPointName = data.GeocodeInfo[0].ROAD;
                            }
                        },
                        complete: function() {
                            source.bindPopup(startPointName, {
                                closeOnClick: false,
                                autoPan: false
                            }).openPopup();
                            target.bindPopup(endPointName, {
                                closeOnClick: false,
                                autoPan: false
                            }).openPopup();

                            findRoute(map, source, target, startLatLng, endLatLng)
                        }
                    });

                });

                targetMarker1.on('dragend', function() {
                    var source = sourceMarker1;
                    var target = targetMarker1;

                    map.eachLayer(function(layer) {
                        if (layer._leaflet_id != 387) {
                            //Clear all layers except tiles
                            map.removeLayer(layer);
                        }
                    });
                    source.addTo(map);
                    target.addTo(map);

                    $.ajax({
                        dataType: 'json',
                        url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                        data: {
                            'token': token,
                            'location': target.getLatLng().lng + "," + target.getLatLng().lat,
                            'buffer': 0,
                        },
                        success: function (data) {
                            console.log("End Point");
                            console.log(data);
                            if (data.GeocodeInfo[0].ErrorMessage == "Invalid location") {
                                endPointName = "Location Cannot Be Found";
                            } else {
                                endPointName = data.GeocodeInfo[0].ROAD;
                            }
                        },
                        complete: function() {

                            source.bindPopup(startPointName, {
                                closeOnClick: false,
                                autoPan: false
                            }).openPopup();
                            target.bindPopup(endPointName, {
                                closeOnClick: false,
                                autoPan: false
                            }).openPopup();

                            findRoute(map, source, target, startLatLng, endLatLng)
                        }
                    });


                });
                //console.log(routeLayer);

            });
        } else {
            if (startLatLng == null) {
                alert("Please enter a valid start Point");
            }
            if (endLatLng == null) {
                alert("Please enter a valid end Point");
            }
        }
    };
})

.controller('profileCtrl', function($scope) {

})

.controller('verifyCtrl', function($scope) {
    $scope.init = function() {
        $scope.passcode = "";
    }

    $scope.add = function(value) {
        if ($scope.passcode.length < 4) {
            $scope.passcode = $scope.passcode + value;
            if ($scope.passcode.length == 4) {
                $timeout(function() {
                    console.log("The four digit code was entered");
                }, 500);
            }
        }
    }

    $scope.delete = function() {
        if ($scope.passcode.length > 0) {
            $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
        }
    }
})

.controller('forgotCtrl', function($scope) {

})


.controller('settingsCtrl', function($scope) {
    $scope.height = "165 cm";
    $scope.weight = "50 kg";
})

function displayInfo(searchVal, lat, lng, type) {
    $('#' + type + 'Point').val(searchVal);
    $('#' + type + 'Point').attr('data-latlng', [lat, lng]);
    $('#' + type + 'Result').html("");
}

function findRoute(map, sourceMarker1, targetMarker1, startLatLng, endLatLng) {
    var routeLayer = L.featureGroup().addTo(map);
    var travelOptions = r360.travelOptions();
    travelOptions.addSource(sourceMarker1);
    travelOptions.addTarget(targetMarker1);
    travelOptions.setTravelType('bike');

    r360.RouteService.getRoutes(travelOptions, function(routes) {
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            r360.LeafletUtil.fadeIn(routeLayer, route, 1000, "travelDistance");
        }
    });

    map.fitBounds([startLatLng, endLatLng], {
        padding: [20, 20]
    });
}
