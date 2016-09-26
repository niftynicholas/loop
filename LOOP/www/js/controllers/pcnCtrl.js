angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout, $ionicLoading, mapData, $cordovaGeolocation, $ionicPopup, $http) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;
    $scope.dataLoaded = false;
    var response = mapData.getData();
    var geotaggedComments = response.geotaggedComments;
    var shelters = response.shelter;
    var toilets = response.toilets;
    var bicycleRental = response.bicycleRental;
    var bicycleParking = response.bicycleParking;
    var drinkingWater = response.drinkingWater;
    var pcn = response.pcn;
    var intraTownCyclingPath = response.intraTownCyclingPath;
    var food = response.food;
    var geotags = L.layerGroup();

    function showCoordinates(e) {
        alert(e.latlng);
    }

    $scope.showPopup = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.wifi">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.wifi) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.wifi;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
    };


    function submitSuggestion(e) {
        // alert("We will add a marker here! " + e.latlng);
        // GLOBAL GEOTAG HERE
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
                L.marker(e.latlng).addTo(geotags).bindPopup(res).openPopup();

                $http({
                    url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/comment/addGeotag",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        token: localStorage.getItem("token"),
                        dateTimeStamp: new Date().getTime(),
                        coordinates: e.latlng,
                        comment: res
                    }
                }).then(function successCallback(response) {
                    window.plugins.toast.showWithOptions({
                        message: "Comment Added Successfully",
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                    });
                }, function errorCallback(response) {
                    alert("Error Saving to database");
                    alert(JSON.stringify(response, null, 4));
                });
            }
        })
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
                contextmenuItems: [
                    //     {
                    //     text: 'Show coordinates',
                    //     callback: showCoordinates
                    // },
                    {
                        text: 'Submit Suggestion',
                        callback: submitSuggestion
                    }
                ]
            }
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

        leafletData.getMap("pcn").then(function(map) {
            if (!$scope.dataLoaded) {
                map.addLayer(geotags);

                function onEachFeature(feature, layer) {
                    if (feature.properties && feature.properties.comment) {
                        layer.bindPopup(feature.properties.comment);
                    }
                }
                var geotaggedLayer = L.geoJson(geotaggedComments, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'commenting',
                            markerColor: 'cadetblue',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });

                var geotaggedCommentsBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-geotagged-comments',
                        icon: 'fa-commenting',
                        title: 'Add Geotagged Comments',
                        onClick: function(control) {
                            map.addLayer(geotaggedLayer);
                            control.state('remove-geotagged-comments');
                        }
                    }, {
                        stateName: 'remove-geotagged-comments',
                        title: 'Remove Geotagged Comments',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(geotaggedLayer);
                            control.state('add-geotagged-comments');
                        }
                    }]
                });

                var pcnLayer = L.geoJson(pcn);
                var pcnBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-pcn',
                        icon: 'fa-road',
                        title: 'Add PCN Layer',
                        onClick: function(control) {
                            map.addLayer(pcnLayer);
                            control.state('remove-pcn');
                        }
                    }, {
                        stateName: 'remove-pcn',
                        title: 'Remove PCN Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(pcnLayer);
                            control.state('add-pcn');
                        }
                    }]
                });

                var intraTownCyclingPathLayer = L.geoJson(intraTownCyclingPath);
                var intraTownCyclingPathBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-intra-town-cycling',
                        icon: 'fa-connectdevelop',
                        title: 'Add IntraTown Cycling Path Layer',
                        onClick: function(control) {
                            map.addLayer(intraTownCyclingPathLayer);
                            control.state('remove-intra-town-cycling');
                        }
                    }, {
                        stateName: 'remove-intra-town-cycling',
                        title: 'Remove IntraTown Cycling Path Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(intraTownCyclingPathLayer);
                            control.state('add-intra-town-cycling');
                        }
                    }]
                });

                var toiletsLayer = L.geoJson(toilets, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'male',
                            markerColor: 'black',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var toiletsBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-toilets',
                        icon: 'fa-male',
                        title: 'Add Toilet Layer',
                        onClick: function(control) {
                            map.addLayer(toiletsLayer);
                            control.state('remove-toilets');
                        }
                    }, {
                        stateName: 'remove-toilets',
                        title: 'Remove Toilet Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(toiletsLayer);
                            control.state('add-toilets');
                        }
                    }]
                });

                var foodLayer = L.geoJson(food, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'cutlery',
                            markerColor: 'red',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var foodBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-food',
                        icon: 'fa-cutlery',
                        title: 'Add Food Layer',
                        onClick: function(control) {
                            map.addLayer(foodLayer);
                            control.state('remove-food');
                        }
                    }, {
                        stateName: 'remove-food',
                        title: 'Remove Food Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(foodLayer);
                            control.state('add-food');
                        }
                    }]
                });

                var sheltersLayer = L.geoJson(shelters, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'umbrella',
                            markerColor: 'orange',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var sheltersBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-shelters',
                        icon: 'fa-umbrella',
                        title: 'Add Shelter Layer',
                        onClick: function(control) {
                            map.addLayer(sheltersLayer);
                            control.state('remove-shelters');
                        }
                    }, {
                        stateName: 'remove-shelters',
                        title: 'Remove Shelter Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(sheltersLayer);
                            control.state('add-shelters');
                        }
                    }]
                });

                var drinkingWaterLayer = L.geoJson(drinkingWater, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'tint',
                            markerColor: 'blue',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var drinkingWaterBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-drinking-water',
                        icon: 'fa-tint',
                        title: 'Add Drinking Water Layer',
                        onClick: function(control) {
                            map.addLayer(drinkingWaterLayer);
                            control.state('remove-drinking-water');
                        }
                    }, {
                        stateName: 'remove-drinking-water',
                        title: 'Remove Drinking Water Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(drinkingWaterLayer);
                            control.state('add-drinking-water');
                        }
                    }]
                });

                var bicycleParkingLayer = L.geoJson(bicycleParking, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'lock',
                            markerColor: 'gray',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var bicycleParkingBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-bicycle-parking',
                        icon: 'fa-lock',
                        title: 'Add Bicyle Parking Layer',
                        onClick: function(control) {
                            map.addLayer(bicycleParkingLayer);
                            control.state('remove-bicycle-parking');
                        }
                    }, {
                        stateName: 'remove-bicycle-parking',
                        title: 'Remove Bicycle Parking Layer',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(bicycleParkingLayer);
                            control.state('add-bicycle-parking');
                        }
                    }]
                });

                var bicycleRentalLayer = L.geoJson(bicycleRental, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'key',
                            markerColor: 'green',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });
                var bicycleRentalBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-bicycle-rental',
                        icon: 'fa-key',
                        title: 'Add Bicycle Rental',
                        onClick: function(control) {
                            map.addLayer(bicycleRentalLayer);
                            control.state('remove-bicycle-rental');
                        }
                    }, {
                        stateName: 'remove-bicycle-rental',
                        title: 'Remove Bicycle Rental',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(bicycleRentalLayer);
                            control.state('add-bicycle-rental');
                        }
                    }]
                });

                // L.easyBar([geotaggedCommentsBtn, pcnBtn, intraTownCyclingPathBtn, toiletsBtn, foodBtn, sheltersBtn, drinkingWaterBtn, bicycleParkingBtn, bicycleRentalBtn], {
                //     position: 'topright'
                // }).addTo(map);
                geotaggedCommentsBtn.addTo(map);
                pcnBtn.addTo(map);
                intraTownCyclingPathBtn.addTo(map);
                toiletsBtn.addTo(map);
                foodBtn.addTo(map);
                sheltersBtn.addTo(map);
                drinkingWaterBtn.addTo(map);
                bicycleParkingBtn.addTo(map);
                bicycleRentalBtn.addTo(map);

                $scope.dataLoaded = true;
            } else {
                //Need to call API to get all geotaggedComments
                //geotaggedComments = API CALL;
                map.removeLayer(geotaggedCommentsBtn);
                var geotaggedLayer = L.geoJson(geotaggedComments, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'commenting',
                            markerColor: 'cadetblue',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });

                var geotaggedCommentsBtn = L.easyButton({
                    id: 'animated-marker-toggle',
                    position: 'topright',
                    type: 'replace',
                    states: [{
                        stateName: 'add-geotagged-comments',
                        icon: 'fa-commenting',
                        title: 'Add Geotagged Comments',
                        onClick: function(control) {
                            map.addLayer(geotaggedLayer);
                            control.state('remove-geotagged-comments');
                        }
                    }, {
                        stateName: 'remove-geotagged-comments',
                        title: 'Remove Geotagged Comments',
                        icon: 'fa-times-circle',
                        onClick: function(control) {
                            map.removeLayer(geotaggedLayer);
                            control.state('add-geotagged-comments');
                        }
                    }]
                });
                geotaggedCommentsBtn.addTo(map);
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
                    // if ($scope.firstLoad) {
                    //     map.setView($scope.currentLocation, 16);
                    //     $scope.firstLoad = false;
                    // }
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
                map.setView($scope.currentLocation, 16);
            });
        } else {
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, 16);
            }, function(err) {
                console.log("Location not found");
            });
        }
    }
})
