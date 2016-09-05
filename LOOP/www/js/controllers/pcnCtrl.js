angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout, $ionicLoading, mapData) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;
    var response = mapData.getData();
    var geotaggedComments = response.geotaggedComments;
    var shelters = response.shelter;
    var toilets = response.toilets;
    var bicycle_rental = response.bicycleRental;
    var bicycle_parking = response.bicycleParking;
    var drinking_water = response.drinkingWater;
    var pcn = response.pcn;
    var intraTownCyclingPath = response.intraTownCyclingPath;

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
        tiles: {
            url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q'
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        layers: {
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
        }
    });

    leafletData.getMap("pcn").then(function(map) {
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
        geotaggedCommentsButton.addTo(map);

        setInterval(function() {
            map.invalidateSize();
        }, 3000); //every 3s
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
                map.setView($scope.currentLocation, 16);
                $scope.firstLoad = false;
            }
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
        });
        map.on('locationerror', function(e) {
            console.log('Location access denied.');
        });
    });

    $scope.locateMe = function() {
        leafletData.getMap("pcn").then(function(map) {
            map.setView($scope.currentLocation);
        });
    }
})
