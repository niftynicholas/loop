angular.module('app.main.controllers')

.controller('planResultCtrl', function($scope, $state, $http, leafletData, $cordovaGeolocation, dataShare, sharedRoute, $ionicPopup, $ionicLoading) {
    $scope.routeColours = ["#1ABC9C", "#53599A", "#086375", "#F0A202", "#EF476F"];
    $scope.results = [];

    $scope.nextRoute = function() {
        if ($scope.no < $scope.results.length) {
            $scope.no++;
        }
    }

    $scope.prevRoute = function() {
        if ($scope.no > 1) {
            $scope.no--;
        }
    }

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
            maxZoom: 18
        }
    });

    $scope.cycle = function(){
        sharedRoute.routepoints = $scope.results[$scope.no-1].geojson.coordinates;
        $state.go("inprogress");
    }

    //To Parameterise edgeBufferTiles / setInterval to Seconds
    leafletData.getMap("planResult").then(function(map) {
        var plannedResultLayers = L.layerGroup().addTo(map);
        var data = dataShare.getData();
        var startLatLng = data.startLatLng;
        var endLatLng = data.endLatLng;
        var startPointName = data.startPointName;
        var endPointName = data.endPointName;
        var type = data.type;
        var oneMapToken = data.oneMapToken;
        dataShare.clearData();

        var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
            attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
            edgeBufferTiles: 2
        }).addTo(map);

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
                lon: startLatLng.lng
            }
        };
        var endCoords = {
            coordinates: {
                lat: endLatLng.lat,
                lon: endLatLng.lng
            }
        };

        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/planRoute",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                start: startCoords,
                end: endCoords,
                k: 3,
                tolerance: 500,
                type: type
            }
        }).then(function successCallback(response) {
            sharedRoute.hasPlanned = true;
            sharedRoute.hasPlannedRoute = true;
            var firstLoad = true;
            $ionicLoading.hide();
            plannedResultLayers.addLayer(sourceMarker1);
            plannedResultLayers.addLayer(targetMarker1);
            sourceMarker1.openPopup();
            targetMarker1.openPopup();

            function onEachFeature(feature, layer) {
                var routeNo = $scope.routesNo++;
                if(firstLoad){
                    $scope.no = routeNo + 1;
                    firstLoad = false;
                }
                layer.on('mousedown', function (e) {
                    $scope.no = routeNo + 1;
                });
            }
            $scope.results = response.data.result;
            console.log($scope.results);
            for(var i=0;i<response.data.result.length;i++){
                var route = response.data.result[i].geojson;
                var routeLayer = L.geoJson(route, {
                    style: {
                        "color": $scope.routeColours[i],
                        "weight": 8,
                        "opacity": 1
                    },
                    onEachFeature: onEachFeature
                });
                plannedResultLayers.addLayer(routeLayer);
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
        },
        function errorCallback(response) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Invalid Location(s)',
                template: 'You have selected invalid start/end point(s). Do you want to replan your route?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log('Yes');
                    $state.go('planRoute');
                } else {
                    console.log('No');
                }
            });
        });

        // sharedRoute.routeLayer = new L.FeatureGroup().addTo(map);
        // var travelOptions = r360.travelOptions();
        // travelOptions.addSource(sourceMarker1);
        // travelOptions.addTarget(targetMarker1);
        // travelOptions.setTravelType('bike');
        //
        // // define what happens if everything goes smoothly
        // var successCallBack = function(routes) {
        //     sharedRoute.hasPlanned = true;
        //     sharedRoute.hasPlannedRoute = true;
        //
        //     for (var i = 0; i < routes.length; i++) {
        //         var route = routes[i];
        //         r360.LeafletUtil.fadeIn(sharedRoute.routeLayer, route, 1000, "travelDistance");
        //         sharedRoute.markerLayer = new L.layerGroup([sourceMarker1, targetMarker1]);
        //         sharedRoute.routepoints = route.points;
        //         map.addLayer(sharedRoute.markerLayer);
        //         targetMarker1.openPopup();
        //         sourceMarker1.openPopup();
        //     }
        //     console.log(sharedRoute);
        // };
        //
        // var errorCallBack = function(status, message) {
        //     console.log("MY STATUS: ");
        //     console.log(status);
        //     console.log("MY ERROR MESSAGE: ");
        //     console.log(message);
        //     var confirmPopup = $ionicPopup.confirm({
        //         title: 'Invalid Location(s)',
        //         template: 'You have selected invalid start/end point(s). Do you want to replan your route?'
        //     });
        //
        //     confirmPopup.then(function(res) {
        //         if (res) {
        //             console.log('Yes');
        //             $state.go('planRoute');
        //         } else {
        //             console.log('No');
        //         }
        //     });
        // };
        //
        // r360.RouteService.getRoutes(travelOptions, successCallBack, errorCallBack);
        //


    }



})