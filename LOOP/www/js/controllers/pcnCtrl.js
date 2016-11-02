angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout, $ionicLoading, mapData, $cordovaGeolocation, $ionicPopup, $http, $ionicModal, CONSTANTS) {
    $scope.caption = 'To submit a Comment or Suggestion, simply TAP & HOLD on the map. Then, TAP on "Submit Comment".';

    $scope.help = function() {
        $scope.walkthrough = true;
    };

    $scope.destroy = function() {
        $scope.walkthrough = false;
    };

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

    $scope.geotags = {
        checked: false
    };
    $scope.pcn = {
        checked: false
    };
    $scope.itpcn = {
        checked: false
    };
    $scope.toilets = {
        checked: false
    };
    $scope.fnb = {
        checked: false
    };
    $scope.shelters = {
        checked: false
    };
    $scope.drinkingwater = {
        checked: false
    };
    $scope.bikelots = {
        checked: false
    };
    $scope.bikerentals = {
        checked: false
    };

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
                    $scope.data.geotag = {
                        cat: $scope.data.cat,
                        comment: $scope.data.comment
                    };
                    if (!$scope.data.comment) {
                        e.preventDefault();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Opps!',
                            template: 'We do not accept blank submissions.'
                        });
                        alertPopup.then(function(res) {});
                    } else {
                        return $scope.data.geotag;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            if (!(typeof res === "undefined")) {
                var commentMarker = L.AwesomeMarkers.icon({
                    icon: 'commenting',
                    markerColor: 'cadetblue',
                    prefix: 'fa'
                });
                var popup = "<b>Category:</b> " + res.cat + "<br><b>Comment:</b> " + res.comment;
                L.marker(e.latlng, {
                    icon: commentMarker
                }).addTo(geotags).bindPopup(popup).openPopup();
                $http({
                    url: CONSTANTS.API_URL + "cyclist/comment/addGeotag",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        token: localStorage.getItem("token"),
                        dateTimeStamp: new Date().getTime(),
                        coordinates: e.latlng,
                        comment: res.comment,
                        category: res.cat
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
            attributionControl: false,
            scrollWheelZoom: true,
            zoomControl: false,
            minZoom: 11,
            maxZoom: 18,
            map: {
                contextmenu: true,
                contextmenuWidth: 140,
                contextmenuItems: [
                    {
                        text: 'Submit Comment',
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
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + CONSTANTS.mapbox_access_token, {
            attribution: '<a href="https://www.mapbox.com/map-feedback/">© Mapbox</a> <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap</a>',
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
    });

    $scope.$on("$ionicView.afterEnter", function() {

        leafletData.getMap("pcn").then(function(map) {
            if (!$scope.dataLoaded) {
                map.addLayer(geotags);

                $scope.geotaggedLayer = L.geoJson(geotaggedComments, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'chatbubble-working',
                            markerColor: 'cadetblue',
                            prefix: 'ion'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });

                var pcnLayer = L.geoJson(pcn, {
                    onEachFeature: onEachFeature
                });
                var intraTownCyclingPathLayer = L.geoJson(intraTownCyclingPath, {
                    onEachFeature: onEachFeature
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

                var sheltersLayer = L.geoJson(shelters, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'umbrella',
                            markerColor: 'orange',
                            prefix: 'ion'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });

                var drinkingWaterLayer = L.geoJson(drinkingWater, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'waterdrop',
                            markerColor: 'blue',
                            prefix: 'ion'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
                });

                var bicycleParkingLayer = L.geoJson(bicycleParking, {
                    pointToLayer: function(feature, latlng) {
                        var smallIcon = L.AwesomeMarkers.icon({
                            icon: 'product-hunt',
                            markerColor: 'gray',
                            prefix: 'fa'
                        });
                        return L.marker(latlng, {
                            icon: smallIcon
                        });
                    },
                    onEachFeature: onEachFeature
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

                $scope.onChangeGeotag = function(isChecked) {
                    if (isChecked) map.addLayer($scope.geotaggedLayer);
                    else map.removeLayer($scope.geotaggedLayer);
                }

                $scope.onChangePCN = function(isChecked) {
                    if (isChecked) map.addLayer(pcnLayer);
                    else map.removeLayer(pcnLayer);
                }

                $scope.onChangeITPCN = function(isChecked) {
                    if (isChecked) map.addLayer(intraTownCyclingPathLayer);
                    else map.removeLayer(intraTownCyclingPathLayer);
                }

                $scope.onChangeToilets = function(isChecked) {
                    if (isChecked) map.addLayer(toiletsLayer);
                    else map.removeLayer(toiletsLayer);
                }

                $scope.onChangeFNB = function(isChecked) {
                    if (isChecked) map.addLayer(foodLayer);
                    else map.removeLayer(foodLayer);
                }

                $scope.onChangeShelters = function(isChecked) {
                    if (isChecked) map.addLayer(sheltersLayer);
                    else map.removeLayer(sheltersLayer);
                }

                $scope.onChangeDrinkingWater = function(isChecked) {
                    if (isChecked) map.addLayer(drinkingWaterLayer);
                    else map.removeLayer(drinkingWaterLayer);
                }

                $scope.onChangeBikeLots = function(isChecked) {
                    if (isChecked) map.addLayer(bicycleParkingLayer);
                    else map.removeLayer(bicycleParkingLayer);
                }

                $scope.onChangeBikeRentals = function(isChecked) {
                    if (isChecked) map.addLayer(bicycleRentalLayer);
                    else map.removeLayer(bicycleRentalLayer);
                }

                var materialOptions = {
                    fab: true,
                    miniFab: true,
                    rippleEffect: true,
                    toolTips: false,
                    color: 'primary'
                }
                var materialZoomControl = new L.Control.MaterialZoom({
                    position: 'topleft'
                }).addTo(map);

                $scope.dataLoaded = true;
            } else {
                $http({
                    url: CONSTANTS.API_URL + "cyclist/comment/getGeotag",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        token: localStorage.getItem("token"),
                        username: localStorage.getItem("username")
                    }
                }).then(function successCallback(response) {
                    if ($scope.geotags.checked) {
                        map.removeLayer($scope.geotaggedLayer);
                    }
                    geotaggedComments = response.data.geotaggedComments;
                    if ($scope.geotags.checked) {
                        $scope.geotaggedLayer = L.geoJson(geotaggedComments, {
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
                        map.addLayer($scope.geotaggedLayer);
                    }
                }, function errorCallback(response) {
                    console.log("Error Saving to database");
                });

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
                map.setView($scope.currentLocation, 18);
            });
        } else {
            $cordovaGeolocation.getCurrentPosition({
                timeout: 3000,
                enableHighAccuracy: true
            }).then(function(position) {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, 18);
            }, function(err) {
                console.log("Location not found");
            });
        }
    }

    $ionicModal.fromTemplateUrl('amenities.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.showOverlay = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.comment && feature.properties.category) {
            layer.bindPopup("<b>Category:</b> " + feature.properties.category + "<br><b>Comment:</b> " + feature.properties.comment);
        }
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }
})
