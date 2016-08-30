angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;

    var shelters;
    var toilets;
    var bicycle_rental;
    var bicycle_parking;
    var drinking_water;
    var geotaggedComments;

    $.ajax({
        dataType: 'json',
        url: 'https://sgcycling-sgloop.rhcloud.com/api/cyclist/amenity/getAmenities',
        async: false,
        method: 'POST',
        data: {
            token: localStorage.getItem("token")
        },
        success: function(response) {
            geotaggedComments = response.geotaggedComments;
            shelters = response.shelter;
            toilets = response.toilets;
            bicycle_rental = response.bicycleRental;
            bicycle_parking = response.bicycleParking;
            drinking_water = response.drinkingWater;
        }
    });

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
            url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q"
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        layers: {
            overlays: {
                toilets: {
                    name: 'Toilets',
                    type: 'geoJSONAwesomeMarker',
                    data: toilets,
                    visibile: false,
                    icon: {
                        icon: 'male',
                        markerColor: 'black',
                        prefix: 'fa'
                    }
                },
                comments: {
                    name: 'Geotagged Comments',
                    type: 'geoJSONAwesomeMarker',
                    data: geotaggedComments,
                    visibile: false,
                    icon: {
                        icon: 'male',
                        markerColor: 'red',
                        prefix: 'fa'
                    }
                },
                shelters: {
                    name: 'Shelters',
                    type: 'geoJSONAwesomeMarker',
                    data: shelters,
                    visibile: false,
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
                    visibile: false,
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
                    visibile: false,
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
                    visibile: false,
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
