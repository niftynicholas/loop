angular.module('app.main.controllers')

.controller('routesNearbyCtrl', function($scope, routeName, $state, $http, leafletData, $timeout, $cordovaGeolocation, CONSTANTS) {
    var profilePictures = JSON.parse(localStorage.getItem("profilePictures"));
    var uids = profilePictures.uids;
    //Used for recording which cid, geojson and coordinates to use inside the leafletData.getMap() method
    $scope.count = 0;
    if (uids.length === 0) {
        uids = 0;
    }
    $scope.hasMoreRoutes = true;
    var currentLocation = null;

    $scope.checkHasMoreRoutes = function() {
        return $scope.hasMoreRoutes;
    }

    //Default Style
    $scope.myStyle = {
        weight: 8,
        opacity: 1,
        color: '#09493E'
    };

    $scope.doRefresh = function(){

        $http({
            url: CONSTANTS.API_URL + "cyclist/route/getNearbyRoutes",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                to: $scope.count,
                uids:uids,
                coordinates: currentLocation
            }
        }).then(function successCallback(response) {
            $scope.routes = response.data.nearbyRoutes;
            $scope.routeComments = response.data.nearbyRoutes;
            localStorage.setItem("nearbyRoutes", JSON.stringify($scope.routes));
            updateProfilePicture(response.data.profilePictures);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.count = 0;
            $timeout(init, 0);
        },
        function errorCallback(response) {
            console.log("response not found");
        });
    }

    //Method that is called after 0seconds after the template has loaded using the $timeout that calls this method
    var init = function() {
        //Loops through the number of routes retrieved to configure the relevant maps
        for (var i = $scope.count; i < $scope.routes.length; i++) {
            var cid = $scope.routes[i].cid;
            leafletData.getMap(cid).then(function(map) {
                //Retrieving the count to retrieve the relevant geojson and fitbound
                var geojson = $scope.routes[$scope.count].route;
                var coordinates = $scope.routes[$scope.count].envelope;
                if(coordinates.length == 2){
                    map.setView(coordinates, 16);
                }else{
                    map.fitBounds(
                        coordinates, {
                            animate: true,
                            reset: true,
                            padding: [25, 25],
                            maxZoom: 16
                        }
                    );
                }
                L.geoJson(geojson, {
                    style: $scope.myStyle,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 2,
                            fillColor: "#09493E",
                            color: "#09493E",
                            opacity: 1});
                        }
                    }).addTo(map);
                    map.invalidateSize();
                    $scope.count = $scope.count + 1;
                })
            }
        };
        //Only configures the map after the template has loaded due to some loading timing between the angular leaflet and html
        //Test whether the timeout is still required, not tested by Wee Kian


        $scope.loadMore = function() {
            $cordovaGeolocation.getCurrentPosition({ timeout: 1000, enableHighAccuracy: true }).then(function (position) {
                currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                $http({
                    url: CONSTANTS.API_URL + "cyclist/route/getNearbyRoutes",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        token: localStorage.getItem("token"),
                        from: $scope.count,
                        uids: uids,
                        coordinates: currentLocation
                    }
                }).then(function successCallback(response) {
                    var additionalNearbyRoutes = response.data.nearbyRoutes;
                    if (additionalNearbyRoutes.length < 10) {
                        $scope.hasMoreRoutes = false;
                    }
                    if(typeof $scope.routes === "undefined"){
                        $scope.routes = response.data.nearbyRoutes;
                        $scope.routeComments = response.data.nearbyRoutes;
                    }else{
                        $scope.routes = $scope.routes.concat(response.data.nearbyRoutes);
                        $scope.routeComments = $scope.routeComments.concat(response.data.nearbyRoutes);
                    }
                    localStorage.setItem("nearbyRoutes", JSON.stringify($scope.routes));
                    updateProfilePicture(response.data.profilePictures);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $timeout(init, 0);
                },
                function errorCallback(response) {
                    console.log("response not found");
                });
            }, function(err) {
                console.log("Location not found");
            });

        };

        var updateProfilePicture = function(addPics) {
            profilePictures.uids.concat(addPics.uids);
            for (var count = 0; count < addPics.uids.length; count++) {
                profilePictures[addPics.uids[count]] = addPics[addPics.uids[count]];
            }
            uids = profilePictures.uids;
            if (uids.length === 0) {
                uids = 0;
            }
            localStorage.setItem("profilePictures", JSON.stringify(profilePictures));
        };

        //Can dump the route data inside here to not need to call getRoute API
        $scope.viewRoute = function(index) {
            routeName.sendData({
                index: index,
                routesType : "nearbyRoutes"
            });
            $state.go("viewRoute");
        }

        angular.extend($scope, {
            center: {
                lat: 1.3521,
                lng: 103.8198,
                zoom: 11
            },
            tiles: {
                url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q"
            },
            defaults: {
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                tap: false,
                zoomControl: false,
                attributionControl: false,
                keyboard: false
            }
        });
    })
