angular.module('app.main.controllers')

.controller('inprogressCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicModal, dataShare, $ionicPlatform, sharedRoute, $cordovaGeolocation, $deviceGyroscope) {
    $scope.distance = 0;
    $scope.currentSpeed = 0;
    $scope.averageSpeed = 0;
    $scope.calories = 0;
    $scope.duration = 0; //In seconds
    $scope.durationInMillis = 0;
    $scope.MET = 8; //FINAL variable to be determined by activity type
    //$scope.age = 25;      //To be retrieve from database
    //$scope.gender = 'M';  //To be retrieve from database
    $scope.weight = 60.0; //To be retrieve from database
    $scope.coordsinfo = []; //stores coordinates information e.g. {lat: xxx, lng: xxx, time: xxx}
    var latlngs = [];
    var polyline = null;
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

    // A tri-state control for map rotation. States are:
    // Locked (default)
    // Unlocked (user can pinch-rotate)
    // Follow (rotation follows device orientation, if available)

    L.Control.Bearing = L.Control.extend({

        options: {
            position: 'topleft',
            closeOnZeroBearing: false
        },

        onAdd: function(map) {
            this._onDeviceOrientation = L.Util.throttle(this._unthrottledOnDeviceOrientation, 100, this);

            var container = this._container = L.DomUtil.create('div', 'leaflet-control-rotate leaflet-bar');

            //this.button = L.Control.Zoom.prototype._createButton.call(this, 'R', 'leaflet-control-rotate', 'leaflet-control-rotate', container, this._toggleLock);

            var glyphs = this._glyphs = L.DomUtil.create('div', 'leaflet-control-rotate-glyphs');
            var north = this._north = L.DomUtil.create('div', 'leaflet-control-rotate-north');
            north.innerHTML = 'N';

            var arrow = this._arrow = L.DomUtil.create('div', 'leaflet-control-rotate-arrow');
            arrow.innerHTML = '&uarr;';


            // Copy-pasted from L.Control.Zoom
            var link = this._link = L.DomUtil.create('a', 'leaflet-control-rotate-toggle', container);
            glyphs.appendChild(north);
            glyphs.appendChild(arrow);
            link.appendChild(glyphs);
            link.href = '#';
            link.title = 'leaflet-control-rotate-toggle';


            L.DomEvent
            .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this._cycleState, this)
            .on(link, 'click', this._refocusOnMap, this);

            if (!L.Browser.any3d) {
                L.DomUtil.addClass(link, 'leaflet-disabled');
            }

            this._restyle();

            map.on('rotate', this._restyle.bind(this));

            // State flag
            this._follow = false;
            this._canFollow = false;

            if (this.options.closeOnZeroBearing && map.getBearing() === 0) {
                container.style.display = 'none';
            }

            return container;
        },

        _cycleState: function(ev) {
            var map = this._map;

            if (!map) { return; }

            if (!map.touchRotate.enabled() && !map.compassBearing.enabled()) {
                // Go from disabled to touch
                map.touchRotate.enable();

                // 				console.log('state is now: touch rotate');
            } else {

                if (!map.compassBearing.enabled()) {
                    // Go from touch to compass
                    map.touchRotate.disable();
                    map.compassBearing.enable();

                    // 					console.log('state is now: compass');

                    // It is possible that compass is not supported. If so,
                    // the hangler will automatically go from compass to disabled.
                } else {
                    // Go from compass to disabled
                    map.compassBearing.disable();

                    // 					console.log('state is now: locked');

                    map.setBearing(0);
                    if (this.options.closeOnZeroBearing) {
                        map.touchRotate.enable();
                    }
                }
            }
            this._restyle();
        },

        _restyle: function() {
            if (this._map.options.rotate) {
                var bearing = this._map.getBearing();
                this._link.style.color = 'inherit';
                if (this.options.closeOnZeroBearing && bearing) {
                    this._container.style.display = 'block';
                }

                var cssTransform = 'rotate(' + bearing + 'deg)';
                this._glyphs.style.transform = cssTransform;

                if (map.compassBearing.enabled()) {
                    this._glyphs.style.color = 'orange';
                } else if (map.touchRotate.enabled()){
                    this._glyphs.style.color = 'inherit';
                } else {
                    this._glyphs.style.color = 'grey';
                    if (this.options.closeOnZeroBearing && map.getBearing() === 0) {
                        this._container.style.display = 'none';
                    }
                }
            } else {
                L.DomUtil.addClass(link, 'leaflet-disabled');
            }
        }
    });



    var osmUrl = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    osmAttrib = 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
    osm = L.tileLayer(osmUrl, {maxZoom: 17, attribution: osmAttrib, rotate:true});

    var map = new L.Map('map', {
        zoom: 15,
        layers: [osm],
        rotate: true
    }).setView([1.3521, 103.8198], 11);

    //map.touchRotate.enable();
    map.addControl(bearingControl = new L.Control.Bearing({closeOnZeroBearing: false}));
    map.compassBearing.enable();

    var currentLoc = L.circle([0, 0], 10, {
        fillColor: '#4183D7', //DarkSlateGray
        opacity: 80,
        fillOpacity: 0.9,
        stroke: false,
        clickable: false,
    }).addTo(map);

    //***************************** ON MAP CREATION ****************************************
    if (map.hasLayer(sharedRoute.data)) {
        map.removeLayer(sharedRoute.data);
    }
    if(sharedRoute.data != false){
        map.addLayer(sharedRoute.data);
    }
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;

    if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
        //Pass currentLocation from cycle.html
        var data = dataShare.getData();
        $scope.currentLoc = new L.LatLng(data.currentLocation.lat, data.currentLocation.lng);
        map.setView($scope.currentLoc, 18);
        currentLoc.setLatLng($scope.currentLoc);
        latlngs.push($scope.currentLoc);
        $scope.coordsinfo.push({ //storing each coordinate information
            lat: data.currentLocation.lat,
            lng: data.currentLocation.lng,
            //alt: e.altitude,
            time: data.time
        });
        dataShare.clearData();

    }

    //***************************** ON WATCH ****************************************
    var setWatch = true;

    setInterval(function() {
        $deviceGyroscope.getCurrent().then(function(result) {
            console.log("X: " + result.x);
            console.log("Y: " + result.y);
            console.log("Y: " + result.z);
            $scope.currentSpeed = Math.round(Math.abs(result.y) * 18.0/5.0);
        }, function(err) {
            // An error occurred. Show a message to the user
            console.log("Cannot find Acceleration");
            //****************** Use Geolocation to Calculate Current Speed ******************
            // var coordinates = $scope.coordsinfo;
            // var latestCoord = coordinates[coordinates.length - 1];
            // var secondLatestCoord = coordinates[coordinates.length - 2];
            // var curSpd = geolib.getSpeed(secondLatestCoord, latestCoord);
            // $scope.currentSpeed = (Math.round(curSpd * 100) / 100);
        });

        $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
            console.log("lat: " + position.coords.latitude + "lng: " + position.coords.longitude);
            $scope.currentLoc = new L.LatLng(position.coords.latitude, position.coords.longitude);
            if (setWatch) {
                map.setView($scope.currentLoc, 18);
            }
            currentLoc.setLatLng($scope.currentLoc);
            latlngs.push($scope.currentLoc);
            $scope.coordsinfo.push({ //storing each coordinate information
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                //alt: e.altitude,
                time: position.timestamp
            });

            if (latlngs.length >= 2) {
                if (polyline != null) {
                    map.removeLayer(polyline);
                }
                polyline = new L.Polyline(latlngs, { color: '#1abc9c', weight: 8 });
                map.addLayer(polyline);
                currentLoc.bringToFront();

                //*********************************
                //Calculate Distance
                //*********************************
                $scope.distance = geolib.getPathLength(polyline.getLatLngs()) / 1000.0;
            }
        }, function(err) {
            console.log("Location not found");
            //alert('Location nt found');
        });
    }, 3000); //every 3s

    $scope.$on('timer-tick', function(event, data) {
        $scope.duration = data.millis / 1000.0;
        if($scope.distance != 0){
            var avgSpd = $scope.distance / ($scope.duration / 3600.0);
            $scope.averageSpeed = (Math.round(avgSpd * 100) / 100);
        }
        var calories = $scope.weight * $scope.MET * ($scope.duration / 3600.0);
        $scope.calories = (Math.round(calories * 100) / 100);
        /*
        ***************GENERIC*******************
        Calories Burned = Weight X MET X Hour
        *****************************************

        **************GENDER SPECIFIC************
        var avgCyclingHeartRate = (220 - $scope.age) * 0.7;
        Men
        = [(Age x 0.2017) * (Weight x 0.09036) + (Heart Rate x 0.6309) * 55.0969] x Minutes / 4.184

        Women
        = [(Age x 0.074) * (Weight x 0.05741) + (Heart Rate x 0.4472) * 20.4022] x Minutes / 4.184
        *****************************************
        */
    });

    $scope.$on('timer-stopped', function (event, data){
        $scope.duration = data.millis / 1000.0;
        $scope.durationInMillis = data.millis;
    });

    map.on("dragend", function () {
        if (setWatch) {
            setWatch = false;
        }
    });

    $scope.locateMe = function () {
        map.setView($scope.currentLoc, 18);
        setWatch = true;
    }

    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Stop Activity',
            template: 'Are you sure you want to stop this activity?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('Confirmed');
                $scope.$broadcast('timer-stop');
                $scope.timerRunning = false;

                data = {
                    distance: $scope.distance,
                    duration: moment().startOf('year').seconds($scope.duration).format('HH:mm:ss'), //moment().startOf('year').seconds(40888).format('HH:mm:ss')
                    averageSpeed: $scope.averageSpeed,
                    calories: $scope.calories,
                    path: latlngs,
                    durationInMillis: $scope.durationInMillis
                };
                dataShare.sendData(data); //pass as JS object
                $state.go('completed');

            } else {
                console.log('Cancelled');
            }
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

function resetHeading(ev) {
    console.log(ev);
    if (ev.heading !== null) {
        map.setBearing(ev.heading);
    }
}
