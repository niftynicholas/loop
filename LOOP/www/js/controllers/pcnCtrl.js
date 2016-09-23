angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout, $ionicLoading, mapData, $cordovaGeolocation) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;
    $scope.loadedGeotaggedComments = false;
    var response = mapData.getData();
    var geotaggedComments = response.geotaggedComments;
    var shelters = response.shelter;
    var toilets = response.toilets;
    var bicycle_rental = response.bicycleRental;
    var bicycle_parking = response.bicycleParking;
    var drinking_water = response.drinkingWater;
    var pcn = response.pcn;
    var intraTownCyclingPath = response.intraTownCyclingPath;
    var food = response.food;

    function showCoordinates(e) {
        alert(e.latlng);
    }

    function submitSuggestion(e) {
        alert("We will add a marker here! " + e.latlng);
        // GLOBAL GEOTAG HERE
        // FOR USER TO SUBMIT SUGGESTIONS
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
                fillColor: '#4183D7',
                opacity: 80,
                fillOpacity: 0.9,
                stroke: false,
                clickable: false,
                latlngs: [0, 0],
                radius: 10
            },
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true,
            map: {
                contextmenu: true,
                contextmenuWidth: 140,
                contextmenuItems: [{
                    text: 'Show coordinates',
                    callback: showCoordinates
                }, {
                    text: 'Submit Suggestion',
                    callback: submitSuggestion
                }]
            }
        },
        layers: {

        }
    });

    $ionicLoading.show({
        template: '<p>Loading Map...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
    });

    leafletData.getMap("pcn").then(function(map) {
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            edgeBufferTiles: 2
        }).addTo(map);
    });

    $scope.$on("$ionicView.afterEnter", function() {
        $scope.layers = {
            overlays: {
                pcn: {
                    name: 'Park Connector Network',
                    type: 'geoJSONAwesomeMarker',
                    data: pcn,
                    visible: false,
                },
                intraTownCyclingPath: {
                    name: 'Intra-Town Cycling Paths',
                    type: 'geoJSONAwesomeMarker',
                    data: intraTownCyclingPath,
                    visible: false
                },
                toilets: {
                    name: 'Toilets',
                    type: 'geoJSONAwesomeMarker',
                    data: toilets,
                    visible: false,
                    icon: {
                        icon: 'male',
                        markerColor: 'black',
                        prefix: 'fa'
                    }
                },
                food: {
                    name: 'F&B',
                    type: 'geoJSONAwesomeMarker',
                    data: food,
                    visible: false,
                    icon: {
                        icon: 'cutlery',
                        markerColor: 'red',
                        prefix: 'fa'
                    }
                },
                shelters: {
                    name: 'Shelters',
                    type: 'geoJSONAwesomeMarker',
                    data: shelters,
                    visible: false,
                    icon: {
                        icon: 'umbrella',
                        markerColor: 'orange',
                        prefix: 'fa'
                    }
                },
                drinking_water: {
                    name: 'Drinking Water Points',
                    type: 'geoJSONAwesomeMarker',
                    data: drinking_water,
                    visible: false,
                    icon: {
                        icon: 'tint',
                        markerColor: 'blue',
                        prefix: 'fa'
                    }
                },
                bicycle_parking: {
                    name: 'Bicycle Parking Lots',
                    type: 'geoJSONAwesomeMarker',
                    data: bicycle_parking,
                    visible: false,
                    icon: {
                        icon: 'bicycle',
                        markerColor: 'gray',
                        prefix: 'fa'
                    }
                },
                bicycle_rental: {
                    name: 'Bicycle Rentals',
                    type: 'geoJSONAwesomeMarker',
                    data: bicycle_rental,
                    visible: false,
                    icon: {
                        icon: 'key',
                        markerColor: 'green',
                        prefix: 'fa'
                    }
                }
            }
        };

        leafletData.getMap("pcn").then(function(map) {
            if (!$scope.loadedGeotaggedComments) {
                function onEachFeature(feature, layer) {
                    if (feature.properties && feature.properties.comment) {
                        layer.bindPopup(feature.properties.comment);
                    }
                }
                var geoJsonLayer = L.geoJson(geotaggedComments, {
                    onEachFeature: onEachFeature
                });

                var geotaggedCommentsButton = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-geotagged-comments',
                        icon: 'fa-map-marker',
                        title: 'Add Geotagged Comments',
                        onClick: function(control) {
                            map.addLayer(geoJsonLayer);
                            control.state('remove-geotagged-comments');
                        }
                    }, {
                        stateName: 'remove-geotagged-comments',
                        title: 'Remove Geotagged Comments',
                        icon: 'fa-undo',
                        onClick: function(control) {
                            map.removeLayer(geoJsonLayer);
                            control.state('add-geotagged-comments');
                        }
                    }]
                });
                // geotaggedCommentsButton.button.style.width = '200px';
                // geotaggedCommentsButton.button.style.height = '100px';
                // geotaggedCommentsButton.addTo(map);

                // var test = L.easyButton({
                //     id: 'animated-marker-toggle',
                //     position: 'topright',
                //     type: 'replace',
                //     states: [{
                //         stateName: 'add-geotagged-comments',
                //         icon: 'fa-map-marker',
                //         title: 'Add Geotagged Comments',
                //         onClick: function(control) {
                //             map.addLayer(geoJsonLayer);
                //             control.state('remove-geotagged-comments');
                //         }
                //     }, {
                //         stateName: 'remove-geotagged-comments',
                //         title: 'Remove Geotagged Comments',
                //         icon: 'fa-undo',
                //         onClick: function(control) {
                //             map.removeLayer(geoJsonLayer);
                //             control.state('add-geotagged-comments');
                //         }
                //     }]
                // });
                // geotaggedCommentsButton.button.style.width = '200px';
                // geotaggedCommentsButton.button.style.height = '100px';
                // test.addTo(map);
                L.easyBar([geotaggedCommentsButton], {
                    position: 'topright'
                }).addTo(map);
                $scope.loadedGeotaggedComments = true;
            }
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
                    if ($scope.firstLoad) {
                        map.setView($scope.currentLocation, 16);
                        $scope.firstLoad = false;
                    }
                    $scope.paths.currentLoc.latlngs = [];
                    $scope.paths.currentLoc.latlngs.push(position.coords.latitude);
                    $scope.paths.currentLoc.latlngs.push(position.coords.longitude);

                }, function(err) {
                    console.log("Location not found");
                });
            }, 3000); //every 3s
        })
        $ionicLoading.hide();
    });

    $scope.locateMe = function() {
        if (typeof $scope.currentLocation.lat !== "undefined") {
            leafletData.getMap("pcn").then(function(map) {
                map.setView($scope.currentLocation);
            });
        } else {
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, function(err) {
                console.log("Location not found");
            });
        }
    }
})
