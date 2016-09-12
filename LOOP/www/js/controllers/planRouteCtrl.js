angular.module('app.main.controllers')

.controller('planRouteCtrl', function($scope, leafletData, $http, $state, $ionicPopup, dataShare, sharedRoute, $cordovaGeolocation) {
    var token = "";
    var searchLimit = 10; //10 or more because has digit 0 to 9 for last digit in postal code

    /**
    * Ajax call to get token from OneMap
    */
    $.ajax({
        dataType: 'json',
        url: 'http://www.onemap.sg/API/services.svc/getToken',
        async: false,
        data: {
            'accessKEY': '2WpSB38gVk6Shp1NiEgk0eTAHRsv4jGu7cs4N1r8KipyJJyB7uN8+hl3LXNq2iX1c/wdJhIStL4a6kEacP8CT/HQfXmkWp25|mv73ZvjFcSo=',
        },
        success: function(data) {
            token = data.GetToken[0].NewToken;
            console.log(token);
        }
    });

    if (typeof(token) == "undefined") {
        token = 'xkg8VRu6Ol+gMH+SUamkRIEB7fKzhwMvfMo/2U8UJcFhdvR4yN1GutmUIA3A6r3LDhot215OVVkZvNRzjl28TNUZgYFSswOi';
    }

    $('#startPoint').focus(function() {
        if (dataShare.data != false && typeof(dataShare.getData().currentLocation.lat) != "undefined") {
            $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + dataShare.getData().currentLocation.lat + ',' + dataShare.getData().currentLocation.lng + ',\'start\')">' + "Current Location" + '</div>');
        }else{
            $cordovaGeolocation.getCurrentPosition({ timeout: 3000, enableHighAccuracy: true }).then(function (position) {
                $('#startResult').append('<div class="item" onclick="displayInfo(\'' + "Current Location" + '\',' + position.coords.latitude + ',' + position.coords.longitude + ',\'start\')">' + "Current Location" + '</div>');
            }, function(err) {
                console.log("Location not found");
            });
        }
    });

    $('#startPoint').focusout(function() {
        $('#startResult').empty();
    });

    $('#endPoint').focusout(function() {
        $('#endResult').empty();
    });

    /**
    * Populate Search Results for Start Point
    */
    $('#startPoint').keyup(function() {
        var input = $('#startPoint').val(),
        type = 'WGS84';
        var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
        $.getJSON(requestURL, {
            'token': token,
            'searchVal': input,
            'projSys': type,
        }, function(data) {
            $('#startResult').html("");
            //If data is length > 2 means there are multiple results
            if (data.SearchResults.length > 2) {
                var toLoopTill = searchLimit;
                if (data.SearchResults.length < 11) {
                    //if results were lesser than current searchLimit set
                    toLoopTill = data.SearchResults.length - 1;
                }
                for (var i = 1; i <= toLoopTill; i++) {
                    var searchVal = data.SearchResults[i].SEARCHVAL;
                    var lat = data.SearchResults[i].Y;
                    var lng = data.SearchResults[i].X;
                    if (searchVal != null) {
                        //Populate the results in the startResult div
                        $('#startResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'start\')">' + searchVal + '</div>');
                    }

                }
            } else if (data.SearchResults.length == 2) {
                //If data length == 2 means there is only 1 result
                $('#startPoint').attr('data-val', data.SearchResults[1].SEARCHVAL);
                $('#startPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
            } else {
                //No results were found
                $('#startResult').html("");
                $('#startPoint').removeAttr("data-latlng");
            }
        });
    });

    /**
    * Populate Search Results for End Point
    */
    $('#endPoint').keyup(function() {
        var input = $('#endPoint').val(),
        type = 'WGS84';
        var requestURL = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?callback=?';
        $.getJSON(requestURL, {
            'token': token,
            'searchVal': input,
            'projSys': type,
        }, function(data) {
            $('#endResult').html("");
            //If data is length > 2 means there are multiple results
            if (data.SearchResults.length > 2) {
                var toLoopTill = searchLimit;
                if (data.SearchResults.length < 11) {
                    //if results were lesser than current searchLimit set
                    toLoopTill = data.SearchResults.length - 1;
                }
                for (var i = 1; i <= toLoopTill; i++) {
                    var searchVal = data.SearchResults[i].SEARCHVAL;
                    var lat = data.SearchResults[i].Y;
                    var lng = data.SearchResults[i].X;
                    if (searchVal != null) {
                        //Populate the results in the endResult div
                        $('#endResult').append('<div class="item" onclick="displayInfo(\'' + searchVal + '\',' + lat + ',' + lng + ',\'end\')">' + searchVal + '</div>');
                    }

                }
            } else if (data.SearchResults.length == 2) {
                //If data length == 2 means there is only 1 result
                $('#endPoint').attr('data-val', data.SearchResults[1].SEARCHVAL);
                $('#endPoint').attr('data-latlng', [data.SearchResults[1].Y, data.SearchResults[1].X]);
            } else {
                //No results were found
                $('#endResult').html("");
                $('#endPoint').removeAttr("data-latlng");
            }
        });
    });

    /**
    * Calculate Route based on Start & End Points
    */
    $scope.planRoute = function() {

        var startInput = document.getElementById("startPoint");
        var endInput = document.getElementById("endPoint");
        var startLatLng = startInput.getAttribute("data-latlng");
        var endLatLng = endInput.getAttribute("data-latlng");

        if (startLatLng != null && endLatLng != null) {


            leafletData.getMap("cycle").then(function(map) {

                //LatLng is "lat, lng" after utilising getAttribute so spliting it gives us our array [lat, lng]
                startLatLng = startLatLng.split(",");
                endLatLng = endLatLng.split(",");


                if(sharedRoute.hasPlanned){
                    map.removeLayer(sharedRoute.markerLayer);
                    map.removeLayer(sharedRoute.routeLayer);
                }

                r360.config.serviceKey = '00AGI2VAF2HNS37EMMLV'; //My Key: 00AGI2VAF2HNS37EMMLV         Website Key: YWtKiQB7MiZETbCoVsG6
                r360.config.serviceUrl = 'https://service.route360.net/malaysia_singapore/';

                var redIcon = L.icon({
                    iconUrl: 'lib/leaflet-route360/marker-icon-red.png',
                    shadowUrl: 'lib/leaflet-route360/marker-shadow.png',
                    iconAnchor: [12, 45],
                    popupAnchor: [0, -35]
                });

                var startPointName = startInput.getAttribute("data-val");
                var endPointName = endInput.getAttribute("data-val");

                var sourceMarker1 = L.marker(startLatLng, {
                    draggable: true
                }).bindPopup(startPointName, {closeOnClick: false,autoPan: false}); //

                var targetMarker1 = L.marker(endLatLng, {
                    draggable: true,
                    icon: redIcon
                }).bindPopup(endPointName, {closeOnClick: false,autoPan: false}); //

                sharedRoute.sourceMarker = {
                    startLatLng: startLatLng,
                    startPointName: startPointName
                };

                sharedRoute.targetMarker = {
                    endLatLng: endLatLng,
                    redIcon: redIcon,
                    endPointName: endPointName
                };

                findRoute(map, sourceMarker1, targetMarker1, sourceMarker1.getLatLng(), targetMarker1.getLatLng(), $scope, $state, $ionicPopup, sharedRoute);

                //targetMarker1.openPopup();
                //sourceMarker1.openPopup();

                sourceMarker1.on('dragend', function() {
                    var source = sourceMarker1;
                    var target = targetMarker1;

                    if(sharedRoute.hasPlanned){
                        map.removeLayer(sharedRoute.markerLayer);
                        map.removeLayer(sharedRoute.routeLayer);
                    }

                    $.ajax({
                        dataType: 'json',
                        url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                        data: {
                            'token': token,
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

                            source.bindPopup(startPointName, { closeOnClick: false,autoPan: false});
                            target.bindPopup(endPointName, {closeOnClick: false,autoPan: false});
                            //source.addTo(sharedRoute.data); //.bindPopup(startPointName, { closeOnClick: false,autoPan: false}).openPopup()
                            //target.addTo(sharedRoute.data); //.bindPopup(endPointName, {closeOnClick: false,autoPan: false}).openPopup()
                            findRoute(map, source, target, source.getLatLng(), target.getLatLng(), $scope, $state, $ionicPopup, sharedRoute);
                            //source.openPopup();
                            //target.openPopup();
                        }
                    });

                }); //End sourceMarker dragend

                targetMarker1.on('dragend', function() {
                    var source = sourceMarker1;
                    var target = targetMarker1;

                    if(sharedRoute.hasPlanned){
                        map.removeLayer(sharedRoute.markerLayer);
                        map.removeLayer(sharedRoute.routeLayer);
                    }

                    $.ajax({
                        dataType: 'json',
                        url: 'http://www.onemap.sg/API/services.svc/revgeocode?callback=?',
                        data: {
                            'token': token,
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

                            source.bindPopup(startPointName, { closeOnClick: false,autoPan: false});
                            target.bindPopup(endPointName, {closeOnClick: false,autoPan: false});
                            //source.addTo(sharedRoute.data); //.bindPopup(startPointName, {closeOnClick: false,autoPan: false}).openPopup()
                            //target.addTo(sharedRoute.data); //.bindPopup(endPointName, { closeOnClick: false, autoPan: false}).openPopup()
                            findRoute(map, source, target, source.getLatLng(), target.getLatLng(), $scope, $state, $ionicPopup, sharedRoute);
                            //source.openPopup();
                            //target.openPopup();
                        }
                    });
                }); //End targetMarker dragend

                $state.go('tabsController.cycle');
            });
        } else {
            if (startLatLng == null && endLatLng == null) {
                $scope.showAlert();
            } else if (startLatLng == null) {
                $scope.showInvalidStartAlert();
            } else if (endLatLng == null) {
                $scope.showInvalidEndAlert();
            }
        }
    };
    // Invalid Start Point
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid Start & End Points',
            template: 'Please select a valid start and end point.'
        });
        alertPopup.then(function(res) {
        });
    };


    // Invalid Start Point
    $scope.showInvalidStartAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid Start Point',
            template: 'Please select a valid start point and try again.'
        });
        alertPopup.then(function(res) {
        });
    };

    // Invalid End Point
    $scope.showInvalidEndAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Invalid End Point',
            template: 'Please select a valid end point and try again.'
        });
        alertPopup.then(function(res) {
        });
    };

    $scope.buttons = [{
        icon: '',
        text: 'Shortest'
    }, {
        icon: '',
        text: 'Safest'
    }];
    $scope.activeButton = 0;
    $scope.setActiveButton = function(index) {
        $scope.activeButton = index;
    };
})

function displayInfo(searchVal, lat, lng, type) {
    $('#' + type + 'Point').val(searchVal);
    $('#' + type + 'Point').attr('data-val', searchVal);
    $('#' + type + 'Point').attr('data-latlng', [lat, lng]);
    $('#' + type + 'Result').html("");
}

function findRoute(map, sourceMarker1, targetMarker1, startLatLng, endLatLng, $scope, $state, $ionicPopup, sharedRoute) {
    sharedRoute.hasPlanned = true;
    sharedRoute.routeLayer = new L.FeatureGroup().addTo(map);
    var travelOptions = r360.travelOptions();
    travelOptions.addSource(sourceMarker1);
    travelOptions.addTarget(targetMarker1);
    travelOptions.setTravelType('bike');

    // define what happens if everything goes smoothly
    var successCallBack = function(routes) {
        //var polylineCoords = [];
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            //sharedRoute.routeLayer = new L.Polyline(route.points, { color: 'green', weight: 8,  dashArray: '10,10' });
            r360.LeafletUtil.fadeIn(sharedRoute.routeLayer, route, 1000, "travelDistance");
            sharedRoute.markerLayer = new L.layerGroup([sourceMarker1, targetMarker1]);
            sharedRoute.routepoints = route.points;
            //map.addLayer(sharedRoute.routeLayer);
            map.addLayer(sharedRoute.markerLayer);
            targetMarker1.openPopup();
            sourceMarker1.openPopup();
        }
    };

    var errorCallBack = function(status, message) {
        console.log("MY STATUS: ");
        console.log(status);
        console.log("MY ERROR MESSAGE: ");
        console.log(message);
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
    };

    r360.RouteService.getRoutes(travelOptions, successCallBack, errorCallBack);

    if ($scope.currentLocation == "undefined") {
        map.fitBounds([startLatLng, endLatLng], { //startLatLng [lat,lng]
            animate: false,
            reset: true,
            maxZoom: 16
        });
    } else {
        map.fitBounds([startLatLng, endLatLng, $scope.currentLocation], {
            animate: false,
            reset: true,
            maxZoom: 16
        });
    }


}
