angular.module('app.main.controllers')

.controller('planResultCtrl', function($scope, $state, $http, leafletData, $cordovaGeolocation, dataShare, sharedRoute, $ionicPopup, $ionicLoading, CONSTANTS) {
    $scope.routeColours = ["#1ABC9C", "#53599A", "#086375", "#F0A202", "#EF476F"];
    $scope.results = [];
    $scope.timetaken = 0;
    $scope.cost = 0;
    var plannedResultLayers = null;
    var pid = null;
    var inActiveStyle = {
        "color": "#000000",
        "weight": 8,
        "opacity": 0.6,
        "dashArray": "10,10"
    };

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

    $scope.cycle = function() {
        sharedRoute.routepoints = $scope.results[$scope.no - 1].geojson.coordinates;
        var data = {
            currentLocation: $scope.currentLocation,
            time: $scope.timestamp,
            startDateTimeStamp: new Date().getTime(),
            pid: pid
        };
        dataShare.clearData();
        dataShare.sendData(data);
        $state.go("inprogress");
    }

    //To Parameterise edgeBufferTiles / setInterval to Seconds
    leafletData.getMap("planResult").then(function(map) {
        plannedResultLayers = L.layerGroup().addTo(map);
        var data = dataShare.getData();
        var startLatLng = data.startLatLng;
        var endLatLng = data.endLatLng;
        var startPointName = data.startPointName;
        var endPointName = data.endPointName;
        var type = data.type.toLowerCase();
        var oneMapToken = data.oneMapToken;
        dataShare.clearData();

        var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
            attribution: '<a href="http://www.opencyclemap.org">© OpenCycleMap</a>',
            edgeBufferTiles: 2
        }).addTo(map);

        var attribution = L.control.attribution({
            position: 'bottomright'
        });

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
                $scope.paths.currentLoc.latlngs = [];
                $scope.paths.currentLoc.latlngs.push(position.coords.latitude);
                $scope.paths.currentLoc.latlngs.push(position.coords.longitude);
                $scope.timestamp = position.timestamp;

            }, function(err) {
                console.log("Location not found");
            });
        }, 3000); //every 3s


        //LatLng is "lat, lng" after utilising getAttribute so spliting it gives us our array [lat, lng]
        var redIcon = L.icon({
            iconUrl: 'lib/leaflet-route360/marker-icon-red.png',
            shadowUrl: 'lib/leaflet-route360/marker-shadow.png',
            iconAnchor: [12, 45],
            popupAnchor: [0, -35]
        });

        var sourceMarker1 = L.marker(startLatLng, {
            draggable: true
        }).bindPopup(startPointName, {
            closeOnClick: false,
            autoPan: false
        }); //

        var targetMarker1 = L.marker(endLatLng, {
            draggable: true,
            icon: redIcon
        }).bindPopup(endPointName, {
            closeOnClick: false,
            autoPan: false
        }); //

        sharedRoute.sourceMarker = {
            startLatLng: startLatLng,
            startPointName: startPointName
        };

        sharedRoute.targetMarker = {
            endLatLng: endLatLng,
            redIcon: redIcon,
            endPointName: endPointName
        };

        findRoute(map, sourceMarker1, targetMarker1, sourceMarker1.getLatLng(), targetMarker1.getLatLng(), type, plannedResultLayers);

        sourceMarker1.on('dragend', function() {
            var source = sourceMarker1;
            var target = targetMarker1;
            source.closePopup();
            target.closePopup();

            $.ajax({
                dataType: 'json',
                url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                data: {
                    'token': oneMapToken,
                    'location': source.getLatLng().lng + "," + source.getLatLng().lat,
                    'buffer': 0,
                },
                success: function(data) {
                    if (data.GeocodeInfo[0].ErrorMessage == "Invalid location" || data.GeocodeInfo[0].ErrorMessage == "No building found") {
                        startPointName = "Invalid Location";
                    } else {
                        startPointName = data.GeocodeInfo[0].ROAD;
                    }
                },
                complete: function() {
                    sharedRoute.sourceMarker.startLatLng = source.getLatLng();
                    sharedRoute.sourceMarker.startPointName = startPointName;
                    sharedRoute.targetMarker.endLatLng = target.getLatLng();
                    sharedRoute.targetMarker.endPointName = endPointName;

                    source.bindPopup(startPointName, {
                        closeOnClick: false,
                        autoPan: false
                    });
                    target.bindPopup(endPointName, {
                        closeOnClick: false,
                        autoPan: false
                    });
                    //source.addTo(sharedRoute.data); //.bindPopup(startPointName, { closeOnClick: false,autoPan: false}).openPopup()
                    //target.addTo(sharedRoute.data); //.bindPopup(endPointName, {closeOnClick: false,autoPan: false}).openPopup()
                    findRoute(map, source, target, source.getLatLng(), target.getLatLng(), type, plannedResultLayers);
                    //source.openPopup();
                    //target.openPopup();
                }
            });

        }); //End sourceMarker dragend

        targetMarker1.on('dragend', function() {
            var source = sourceMarker1;
            var target = targetMarker1;
            source.closePopup();
            target.closePopup();
            $.ajax({
                dataType: 'json',
                url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                data: {
                    'token': oneMapToken,
                    'location': target.getLatLng().lng + "," + target.getLatLng().lat,
                    'buffer': 0,
                },
                success: function(data) {
                    if (data.GeocodeInfo[0].ErrorMessage == "Invalid location" || data.GeocodeInfo[0].ErrorMessage == "No building found") {
                        endPointName = "Invalid Location";
                    } else {
                        endPointName = data.GeocodeInfo[0].ROAD;
                    }
                },
                complete: function() {
                    sharedRoute.sourceMarker.startLatLng = source.getLatLng();
                    sharedRoute.sourceMarker.startPointName = startPointName;
                    sharedRoute.targetMarker.endLatLng = target.getLatLng();
                    sharedRoute.targetMarker.endPointName = endPointName;

                    source.bindPopup(startPointName, {
                        closeOnClick: false,
                        autoPan: false
                    });
                    target.bindPopup(endPointName, {
                        closeOnClick: false,
                        autoPan: false
                    });
                    //source.addTo(sharedRoute.data); //.bindPopup(startPointName, {closeOnClick: false,autoPan: false}).openPopup()
                    //target.addTo(sharedRoute.data); //.bindPopup(endPointName, { closeOnClick: false, autoPan: false}).openPopup()
                    findRoute(map, source, target, source.getLatLng(), target.getLatLng(), type, plannedResultLayers);
                    //source.openPopup();
                    //target.openPopup();
                }
            });
        }); //End targetMarker dragend


    });

    $scope.nextRoute = function() {
        if ($scope.no < $scope.results.length) {
            $scope.no++;
            setActiveLayer();
        }
    }

    $scope.prevRoute = function() {
        if ($scope.no > 1) {
            $scope.no--;
            setActiveLayer();
        }
    }

    function setActiveLayer() {
        var layerNum = 1;
        plannedResultLayers.eachLayer(function(anotherLayer) {
            if (anotherLayer instanceof L.GeoJSON) {
                if (layerNum == $scope.no) {
                    anotherLayer.setStyle({
                        "color": $scope.routeColours[$scope.no - 1],
                        "weight": 8,
                        "opacity": 1,
                        "dashArray": ""
                    });
                    anotherLayer.bringToFront();
                } else {
                    anotherLayer.setStyle(inActiveStyle);
                }
                layerNum++;
            }
        });
    }

    function findRoute(map, sourceMarker1, targetMarker1, startLatLng, endLatLng, type, plannedResultLayers) {
        $scope.routesNo = 0;
        $scope.no = -1;
        plannedResultLayers.clearLayers();
        $ionicLoading.show({
            template: '<p>Retrieving Route...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        });
        var startCoords = {
            coordinates: {
                lat: startLatLng.lat,
                lng: startLatLng.lng
            }
        };
        var endCoords = {
            coordinates: {
                lat: endLatLng.lat,
                lng: endLatLng.lng
            }
        };
        $http({
            url: CONSTANTS.API_URL + "cyclist/route/planRoute",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                start: startCoords,
                end: endCoords,
                dateTimeStamp: new Date().getTime(),
                k: 2, // No. of routes to be returned.
                tolerance: 500,
                type: type
            }
        }).then(function successCallback(response) {
            $scope.results = response.data.result;
            $ionicLoading.hide();
            if($scope.results.length == 0){
                var confirmPopup = $ionicPopup.alert({
                    title: 'Oops',
                    template: 'There are no cycling routes between the start and end points.'
                });

                confirmPopup.then(function(res) {
                    $state.go('planRoute');
                });
            }else{
                pid = response.data.pid
                sharedRoute.hasPlanned = true;
                sharedRoute.hasPlannedRoute = true;
                var firstLoad = true;
                plannedResultLayers.addLayer(sourceMarker1);
                plannedResultLayers.addLayer(targetMarker1);
                sourceMarker1.openPopup();
                targetMarker1.openPopup();

                function onEachFeature(feature, layer) {
                    $scope.timetaken = feature.properties.timetaken
                    $scope.cost = feature.properties.cost
                    var routeNo = $scope.routesNo++;
                    if (firstLoad) {
                        $scope.no = routeNo + 1;
                        firstLoad = false;
                        layer.setStyle({
                            "color": $scope.routeColours[$scope.no - 1],
                            "weight": 8,
                            "opacity": 1,
                            "dashArray": ""
                        });
                    }
                    layer.on('mousedown', function(e) {
                        plannedResultLayers.eachLayer(function(anotherLayer) {
                            if (anotherLayer instanceof L.GeoJSON) {
                                anotherLayer.setStyle(inActiveStyle);
                            }
                        });
                        $scope.no = routeNo + 1;
                        layer.bringToFront();
                        layer.setStyle({
                            "color": $scope.routeColours[$scope.no - 1],
                            "weight": 8,
                            "opacity": 1,
                            "dashArray": ""
                        });
                    });
                }

                for (var i = 0; i < response.data.result.length; i++) {
                    var route = response.data.result[i].geojson;
                    var routeLayer = L.geoJson(route, {
                        style: inActiveStyle,
                        onEachFeature: onEachFeature
                    });
                    plannedResultLayers.addLayer(routeLayer);
                    routeLayer.bringToBack();
                }

                if ($scope.currentLocation == "undefined") {
                    map.fitBounds([startLatLng, endLatLng], { //startLatLng [lat,lng]
                        animate: false,
                        reset: true,
                        maxZoom: 16,
                        padding: [80, 80]
                    });
                } else {
                    map.fitBounds([startLatLng, endLatLng, $scope.currentLocation], {
                        animate: false,
                        reset: true,
                        maxZoom: 16,
                        padding: [80, 80]
                    });
                }
            }

        },
        function errorCallback(response) {
            $ionicLoading.hide();
            var confirmPopup = $ionicPopup.alert({
                title: 'Invalid Location(s)',
                template: 'You have selected invalid start/end point(s). Please replan your route.'
            });

            confirmPopup.then(function(res) {
                $state.go('planRoute');
            });
        });

    }



})
