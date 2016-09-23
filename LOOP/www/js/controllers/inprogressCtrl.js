angular.module('app.main.controllers')

.controller('inprogressCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicModal, dataShare, $ionicPlatform, sharedRoute, $cordovaGeolocation, viewSharedRoute) {
    $scope.distance = 0;
    $scope.currentSpeed = 0;
    $scope.averageSpeed = 0;
    $scope.calories = 0;
    $scope.duration = 0; //In seconds
    $scope.durationInSeconds = 0;
    $scope.MET = 8; //FINAL variable to be determined by activity type
    //$scope.age = 25;      //To be retrieve from database
    //$scope.gender = 'M';  //To be retrieve from database
    $scope.weight = 60.0; //To be retrieve from database
    $scope.coordsinfo = []; //stores coordinates information e.g. {lat: xxx, lng: xxx, time: xxx}
    $scope.currentLoc = null;
    var latlngs = [];
    var polyline = null;
    var data;
    var geotags = L.layerGroup();
    var geotagsInfo = [];

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

    var osmUrl = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    osmAttrib = 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
    osm = L.tileLayer(osmUrl, {maxZoom: 17, attribution: osmAttrib, rotate:true, edgeBufferTiles: 2}).setZIndex(-100);

    var map = new L.Map('inprogress', {
        zoom: 15,
        layers: [osm],
    }).setView([1.3521, 103.8198], 11);

    //Adding the GeoTags Layer into Map
    geotags.addTo(map);

    var currentLoc = L.circleMarker([0, 0], {
        fillColor: '#4183D7', //DarkSlateGray
        opacity: 80,
        fillOpacity: 0.9,
        stroke: false,
        clickable: false,
    }).addTo(map).bringToFront();

    //***************************** ON MAP CREATION ****************************************
    var plannedRoute = null;
    if(sharedRoute.hasPlanned){
        var sourceMarker1 = L.marker(sharedRoute.sourceMarker.startLatLng, {
        }).bindPopup(sharedRoute.sourceMarker.startPointName, {closeOnClick: false,autoPan: false}); //.openPopup()

        var targetMarker1 = L.marker(sharedRoute.targetMarker.endLatLng, {
            icon: sharedRoute.targetMarker.redIcon
        }).bindPopup(sharedRoute.targetMarker.endPointName, {closeOnClick: false,autoPan: false}); //.openPopup()

        L.layerGroup([sourceMarker1, targetMarker1]).addTo(map);
        sourceMarker1.openPopup();
        targetMarker1.openPopup();
        //var polyline = new L.Polyline(sharedRoute.routepoints, { color: 'green', weight: 8,  dashArray: '10,10' });
        plannedRoute = new L.Polyline(sharedRoute.routepoints, { color: '#09493E', weight: 5});
        map.addLayer(plannedRoute);
    }

    if(viewSharedRoute.hasPlanned){
        plannedRoute = L.geoJson(viewSharedRoute.routeLayer,{
            style: {
                "color": "#09493E",
                "weight": 5,
                "opacity": 1
            }
        });
        map.addLayer(plannedRoute);
        viewSharedRoute.routeLayer = null;
    }

    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;

    $scope.startDateTimeStamp = dataShare.data.startDateTimeStamp || viewSharedRoute.startDateTimeStamp;

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
    }

    dataShare.clearData();
    //***************************** ON WATCH ****************************************
    var setWatch = true;
    setInterval(function() {

        $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
            //console.log("lat: " + position.coords.latitude + "lng: " + position.coords.longitude);
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
                var latestCoord = $scope.coordsinfo[$scope.coordsinfo.length - 1];
                var secondLatestCoord = $scope.coordsinfo[$scope.coordsinfo.length - 2];
                var curSpd = geolib.getSpeed(secondLatestCoord, latestCoord);
                if(!isNaN(curSpd)){
                    $scope.currentSpeed = (Math.round(curSpd * 100) / 100);
                }

                if (polyline != null) {
                    map.removeLayer(polyline);
                }
                polyline = new L.Polyline(latlngs, { color: '#1ABC9C', weight: 8 }).bringToFront();
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
        $scope.durationInSeconds = data.millis/1000.0;
    });

    map.on("dragend", function () {
        if (setWatch) {
            setWatch = false;
        }
    });

    $scope.locateMe = function () {
        if($scope.currentLoc != null){
            map.setView($scope.currentLoc, 18);
        }else{
            $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
                map.setView({lat: position.coords.latitude, lng: position.coords.longitude});
            }, function(err) {
                console.log("Location not found");
            });
        }
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
                    durationInSeconds: $scope.durationInSeconds,
                    startDateTimeStamp: $scope.startDateTimeStamp,
                    geotagsInfo: geotagsInfo,
                    referencedCID: viewSharedRoute.cid
                };
                dataShare.sendData(data); //pass as JS object
                viewSharedRoute.clearData();
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
                    if($scope.data.geotag) return $scope.data.geotag;
                    else $scope.data.geotag = "";
                }
            }]
        });

        myPopup.then(function(res) {
            if($scope.data.geotag == ""){
                console.log("You have entered an empty comment");
            }
            else if(typeof res === "undefined"){
                console.log("You have cancelled Geotag");
            }else{
                if($scope.currentLoc != null){
                    L.marker($scope.currentLoc).addTo(geotags).bindPopup(res).openPopup();
                    geotagsInfo.push(
                        {
                            dateTimeStamp: new Date().getTime(),
                            coordinates: $scope.currentLoc,
                            comment: res
                        }
                    );
                    console.log('Succesfully added');
                }else{
                     alert("Current Location cannot be Found");
                }
            }
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
