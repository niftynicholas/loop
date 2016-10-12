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
    var currentPath = [];
    var latlngs = [];
    var polyline = null;
    var data;
    var geotagsInfo = [];
    var plannedMarkerLayer = null;

    $scope.hasPlannedRoute = function() {
        return sharedRoute.hasPlannedRoute;
    }

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

    var view = new ol.View({
        projection: 'EPSG:4326',
        center: [103.8198, 1.3521],
        // center: ol.proj.transform([103.8198, 1.3521], 'EPSG:4326', 'EPSG:3857'),
        zoom: 11,
        minZoom: 11,
        maxZoom: 18
    });

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                preload: 2,
                source: new ol.source.OSM({
                    attributions: [
                        new ol.Attribution({
                            html: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
                        }),
                    ],
                    "url": "http://tile2.opencyclemap.org/cycle/{z}/{x}/{y}.png"
                })
            })
        ],
        target: 'inprogress',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        interactions: ol.interaction.defaults({
            altShiftDragRotate: false,
            pinchRotate: true,
            dragPan: true
        }),
        view: view
    });

    //***************************** ON MAP CREATION ****************************************
    if (sharedRoute.hasPlanned) {

        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point([sharedRoute.sourceMarker.startLatLng[1], sharedRoute.sourceMarker.startLatLng[0]]),
            name: sharedRoute.sourceMarker.startPointName,
            type: 'Start'
        });

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: 'lib/leaflet/images/marker-icon.png',
                rotateWithView: "true"
            }))
        });
        iconFeature.setStyle(iconStyle);

        var iconFeature2 = new ol.Feature({
            geometry: new ol.geom.Point([sharedRoute.targetMarker.endLatLng[1], sharedRoute.targetMarker.endLatLng[0]]),
            name: sharedRoute.targetMarker.endPointName,
            type: 'End'
        });

        var iconStyle2 = new ol.style.Style({
            image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: 'lib/leaflet-route360/marker-icon-red.png',
                rotateWithView: "true"
            }))
        });
        iconFeature2.setStyle(iconStyle2);

        var plannedRoute = new ol.Feature({
            geometry: new ol.geom.MultiLineString(sharedRoute.routepoints),
            name: 'Path'
        });
        plannedRoute.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 8,
                color: '#09493E',
                rotateWithView: "true"
            })
        }));

        var Features = [];
        Features.push(plannedRoute);

        var vectorSource = new ol.source.Vector({
            features: Features
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        map.addLayer(vectorLayer);


        var plannedMarker = [];
        plannedMarker.push(iconFeature);
        plannedMarker.push(iconFeature2);

        var plannedMarkerSource = new ol.source.Vector({
            features: plannedMarker
        });

        plannedMarkerLayer = new ol.layer.Vector({
            source: plannedMarkerSource
        });
        map.addLayer(plannedMarkerLayer);

        var element = document.getElementById("popup");

        var popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false
        });
        map.addOverlay(popup);

        var element1 = document.getElementById('popup1');

        var popup1 = new ol.Overlay({
            element: element1,
            positioning: 'bottom-center',
            stopEvent: false
        });
        map.addOverlay(popup1);

        popup.setPosition([sharedRoute.sourceMarker.startLatLng[1], sharedRoute.sourceMarker.startLatLng[0]]);
        $("#popup").popover({
            'placement': 'top',
            'html': true,
            'content': sharedRoute.sourceMarker.startPointName
        });

        popup1.setPosition([sharedRoute.targetMarker.endLatLng[1], sharedRoute.targetMarker.endLatLng[0]]);
        $("#popup1").popover({
            'placement': 'top',
            'html': true,
            'content': sharedRoute.targetMarker.endPointName
        });

    }

    if (viewSharedRoute.hasPlanned) {

        var sharedRoute = new ol.Feature({
            geometry: new ol.geom.LineString(viewSharedRoute.routeLayer.coordinates),
            name: 'Path'
        });
        sharedRoute.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 5,
                color: '#09493E',
                rotateWithView: "true"
            })
        }));
        var vectorSource = new ol.source.Vector({
            features: [sharedRoute] // add an array of features
        });
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource // add source for vectorLayer
        });
        map.addLayer(vectorLayer) // add vectorLayer to map
        viewSharedRoute.routeLayer = null;
    }

    //Current Location & Path Layer
    var currentLoc = new ol.Feature({
        geometry: new ol.geom.Point([0, 0]),
        name: 'Point Two'
    });
    currentLoc.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#4183D7'
            }),
            // stroke: new ol.style.Stroke({
            //     color: '#fff',
            //     width: 2
            // }),
            rotateWithView: "true"
        })
    }));

    var path = new ol.Feature({
        geometry: new ol.geom.LineString([
            [0, 0],
            [0, 0]
        ]),
        name: 'Path'
    });
    path.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 8,
            color: '#1ABC9C',
            rotateWithView: "true"
        })
    }));
    var Features = [];

    Features.push(path);
    Features.push(currentLoc);

    var vectorSource = new ol.source.Vector({
        features: Features // add an array of features
    });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource // add source for vectorLayer
    });

    map.addLayer(vectorLayer) // add vectorLayer to map

    //Adding the GeoTags Layer into Map
    var geotagSource = new ol.source.Vector({
        features: Features
    });

    var geotagLayer = new ol.layer.Vector({
        source: geotagSource
    });
    map.addLayer(geotagLayer);

    var geotag = document.getElementById('geotag');

    var geotagPopupLayer = new ol.Overlay({
        element: geotag,
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(geotagPopupLayer);

    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;

    $scope.startDateTimeStamp = dataShare.data.startDateTimeStamp || viewSharedRoute.startDateTimeStamp;

    if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
        //Pass currentLocation from cycle.html
        var data = dataShare.getData();
        $scope.currentLoc = [data.currentLocation.lng, data.currentLocation.lat]; //GeoJson Format, EPSG:4326
        view.setCenter($scope.currentLoc);
        view.setZoom(18);
        currentLoc.setGeometry(new ol.geom.Point($scope.currentLoc));
        currentPath.push($scope.currentLoc);
        latlngs.push({
            lat: data.currentLocation.lat,
            lng: data.currentLocation.lng
        });
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
    var watch = setInterval(function() {

        $cordovaGeolocation.getCurrentPosition({
            timeout: 3000,
            enableHighAccuracy: true
        }).then(function(position) {
            //console.log("lat: " + position.coords.latitude + "lng: " + position.coords.longitude);
            $scope.currentLoc = [position.coords.longitude, position.coords.latitude]; //GeoJson Format, EPSG:4326
            currentLoc.setGeometry(new ol.geom.Point($scope.currentLoc));
            if (setWatch) {
                view.setCenter($scope.currentLoc);
                view.setZoom(18);
            }
            currentPath.push($scope.currentLoc);
            latlngs.push({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
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
                if (!isNaN(curSpd)) {
                    $scope.currentSpeed = (Math.round(curSpd * 100) / 100);
                }

                path.setGeometry(new ol.geom.LineString(currentPath));

                //To ensure Planned Marker Layer is always on top
                if (plannedMarkerLayer != null) {
                    map.removeLayer(plannedMarkerLayer);
                    map.addLayer(plannedMarkerLayer);
                }
                //*********************************
                //Calculate Distance
                //*********************************
                $scope.distance = geolib.getPathLength(path.getGeometry().getCoordinates()) / 1000.0;
            }
        }, function(err) {
            console.log("Location not found");
            //alert('Location nt found');
        });

    }, 3000); //every 3s

    $scope.$on('timer-tick', function(event, data) {
        $scope.duration = data.millis / 1000.0;
        if ($scope.distance != 0) {
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

    $scope.$on('timer-stopped', function(event, data) {
        $scope.duration = data.millis / 1000.0;
        $scope.durationInSeconds = data.millis / 1000.0;
    });

    map.on("pointerdrag", function() {
        // $("#popup").popover('hide');
        // $("#popup1").popover('hide');
        // $("#geotag").popover('hide');
        $("#geotag").popover('destroy');
        if (setWatch) {
            setWatch = false;
        }
    });

    // display popup on click
    map.on('click', function(evt) {
        $("#geotag").popover('destroy');
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });
        if (typeof feature === "undefined") {
            feature = map.forEachFeatureAtPixel([evt.pixel[0], evt.pixel[1] + 10], function(feature) {
                return feature;
            });
        }
        if (typeof feature === "undefined") {
            feature = map.forEachFeatureAtPixel([evt.pixel[0], evt.pixel[1] + 20], function(feature) {
                return feature;
            });
        }
        if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();
            if (feature.get('type') == 'Start') {
                $("#popup").popover('toggle');
            } else if (feature.get('type') == 'End') {
                $("#popup1").popover('toggle');
            } else if (feature.get('type') == 'geotag') {
                geotagPopupLayer.setPosition(coordinates);
                $("#geotag").popover({
                    'placement': 'top',
                    'html': true,
                    'content': feature.get('name')
                });
                $("#geotag").popover('show');
            }
        }
    });

    $scope.showLastGeotag = function() {
        var lastGeotagInfo = geotagsInfo[geotagsInfo.length - 1];
        if (typeof lastGeotagInfo != "undefined") {
            $("#geotag").popover('destroy');
            geotagPopupLayer.setPosition(lastGeotagInfo.coordinates);
            $("#geotag").popover({
                'placement': 'top',
                'html': true,
                'content': lastGeotagInfo.comment
            });
            $("#geotag").popover('show');
        }
    }

    $scope.toggleStartEndLoc = function() {
        $("#popup").popover('toggle');
        $("#popup1").popover('toggle');
    }

    $scope.locateMe = function() {
        if ($scope.currentLoc != null) {
            var pan = ol.animation.pan({
                duration: 500,
                source: /** @type {ol.Coordinate} */ (view.getCenter())
            });
            map.beforeRender(pan);
            view.setCenter($scope.currentLoc);
            view.setZoom(18);
        } else {
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                view.setCenter([position.coords.longitude, position.coords.latitude]);
                view.setZoom(18);
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
                clearInterval(watch);
                $state.go('completed');

            } else {
                console.log('Cancelled');
            }
        });
    };

    $scope.geotag = function() {
        $scope.data = {
            cat: "Others"
        };
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<div class="list"><label class="item item-input item-select"><div class="input-label">Category</div><select ng-model="data.cat"><option value="Construction">Construction</option><option value="Overgrown Tree Roots">Overgrown Tree Roots</option><option value="Path Obstruction">Path Obstruction</option><option value="Potholes">Potholes</option><option value="Suggestion">Suggestion</option><option value="Others">Others</option></select></label></div><input type="text" placeholder="Comments" ng-model="data.comment">',
            title: "Any Comment or Suggestion?",
            subTitle: 'Share it with other cyclists.',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    $scope.data.geotag = 'Category: ' + $scope.data.cat + ', Comment: ' + $scope.data.comment;
                    if (!$scope.data.comment) {
                        e.preventDefault();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Opps!',
                            template: 'We do not accept blank submissions.'
                        });

                        alertPopup.then(function(res) {

                        });
                    } else {
                        return $scope.data.geotag;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            if (!(typeof res === "undefined")) {
                if ($scope.currentLoc != null) {
                    // L.marker($scope.currentLoc).addTo(geotags).bindPopup(res).openPopup();
                    var geotagFeature = new ol.Feature({
                        geometry: new ol.geom.Point($scope.currentLoc),
                        name: res,
                        type: "geotag"
                    });
                    var commentStyle = new ol.style.Style({
                        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                            anchor: [0.5, 46],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            opacity: 1,
                            src: 'lib/openlayers/geotag-marker.png',
                            rotateWithView: "true"
                        }))
                    });
                    geotagFeature.setStyle(commentStyle);
                    geotagSource.addFeatures([geotagFeature]);

                    geotagPopupLayer.setPosition($scope.currentLoc);
                    $("#geotag").popover('destroy');
                    $("#geotag").popover({
                        'placement': 'top',
                        'html': true,
                        'content': res
                    });
                    $("#geotag").popover('show');

                    geotagsInfo.push({
                        dateTimeStamp: new Date().getTime(),
                        coordinates: $scope.currentLoc,
                        comment: res
                    });
                    window.plugins.toast.showWithOptions({
                        message: "Comment Added Successfully",
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                    });
                } else {
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
