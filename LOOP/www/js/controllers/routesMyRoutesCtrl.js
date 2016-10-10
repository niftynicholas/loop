angular.module('app.main.controllers')

.controller('routesMyRoutesCtrl', function($scope, routeName, $state, $http, leafletData, $timeout) {
    var profilePictures = JSON.parse(localStorage.getItem("profilePictures"));
    var uids = profilePictures.uids;
    if (uids.length === 0) {
      uids = 0;
    }
    //Retrieves and parses the popularRoutes that was retrieved when the user logged in
    $scope.routes = JSON.parse(localStorage.getItem("userRoutes"));
    //Pre-existing scope variable
    $scope.routeComments = JSON.parse(localStorage.getItem("userRoutes"));
    $scope.hasMoreRoutes = true;
    $scope.$on('$ionicView.enter', function(){
        $scope.routeComments = JSON.parse(localStorage.getItem("userRoutes"));
    });
    $scope.checkHasMoreRoutes = function() {
        return $scope.hasMoreRoutes;
    }

    //Default Style
    $scope.myStyle = {
        weight: 8,
        opacity: 1,
        color: '#09493E'
    };

    //Used for recording which cid, geojson and coordinates to use inside the leafletData.getMap() method
    $scope.count = 0;

    //Used for the leafletData.getMap() to find the map with the cid
    $scope.cidList = [];

    //Used for drawing the line inside the retrieved map
    $scope.geojsonList = [];

    //Used for fitbound of the retrieved map
    $scope.coordinatesList = [];

    $scope.doRefresh = function(){

        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getUserRoutes2",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                to: $scope.count,
                uids : uids
            }
        }).then(function successCallback(response) {
            $scope.routes = response.data.userRoutes;
            $scope.routeComments = response.data.userRoutes;
            localStorage.setItem("userRoutes", JSON.stringify($scope.routes));
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
        $timeout(init, 0);

        $scope.loadMore = function() {
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getUserRoutes2",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    from: $scope.count,
                    uids:uids
                }
            }).then(function successCallback(response) {
                var additionalUserRoutes = response.data.userRoutes;
                if (additionalUserRoutes.length < 10) {
                    $scope.hasMoreRoutes = false;
                }
                $scope.routes = $scope.routes.concat(response.data.userRoutes);
                $scope.routeComments = $scope.routeComments.concat(response.data.userRoutes);
                localStorage.setItem("userRoutes", JSON.stringify($scope.routes));
                updateProfilePicture(response.data.profilePictures);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                init();
            },
            function errorCallback(response) {
                console.log("response not found");
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
                routesType: "userRoutes"
            });
            $state.go("viewRoute");
        }

        // $scope.editRoute = function(cid){
        //     alert("EDIT");
        // }

        $scope.deleteRoute = function(cid){
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/deleteRoute",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    cid:cid
                }
            }).then(function successCallback(response) {
                for(var i = 0; i<$scope.routes.length; i++){
                    if($scope.routes[i].cid == cid){
                        $scope.routes.splice(i,1);
                        localStorage.setItem("userRoutes", JSON.stringify($scope.routes));
                        break;
                    }
                }
                console.log('Route Deleted Successfully');
            },
            function errorCallback(response) {
                console.log("response not found");
            });
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
