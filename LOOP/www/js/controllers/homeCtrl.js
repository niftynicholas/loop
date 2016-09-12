angular.module('app.main.controllers')

.controller('homeCtrl', function($scope, homeData, routeName, $state, $http, $timeout, $parse, leafletData) {

    //Retrieves and parses the popularRoutes that was retrieved when the user logged in
    $scope.routes = JSON.parse(localStorage.getItem("popularRoutes"));
    $scope.hasMoreRoutes = true;

    $scope.checkHasMoreRoutes = function() {
        return $scope.hasMoreRoutes;
    }

    //Pre-existing scope variable
    $scope.firstLoad = true;

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

    //Method that is called after 0seconds after the template has loaded using the $timeout that calls this method
    var reinit = function() {

        //Retrieves the length of the popularRoutes array containing individual routes sorted by ranking
        var len = $scope.routes.length;
        //console.log("len " + len);
        //console.log($scope.count);
        for (var i = $scope.count; i < len; i++) {
            //console.log("count is " + i);
            //console.log("cid is " + $scope.routes[i].cid);
            //Pushes the Cid, geojson, fitbound coordinates into the respective scope variables
            $scope.cidList.push($scope.routes[i].cid);
            $scope.geojsonList.push($scope.routes[i].route);
            $scope.coordinatesList.push($scope.routes[i].envelope);
        }
        //Loops through the number of routes retrieved to configure the relevant maps
        for (var i = $scope.count; i < $scope.cidList.length; i++) {
            var cid = $scope.cidList[i];
            console.log(cid);
            leafletData.getMap(cid).then(function(map) {
                //Retrieving the count to retrieve the relevant geojson and fitbound
                var count = $scope.count;
                var geojson = $scope.geojsonList[count];
                var coordinates = $scope.coordinatesList[count];
                map.fitBounds(
                    coordinates, {
                        animate: true,
                        reset: true,
                        padding: [25, 25],
                        maxZoom: 16
                    }
                );
                L.geoJson(geojson, {
                    style: $scope.myStyle
                }).addTo(map);
                map.invalidateSize();
                $scope.count = $scope.count + 1;
            })
        }
    }
    var init = function() {
        if ($scope.firstLoad) {

            //Retrieves the length of the popularRoutes array containing individual routes sorted by ranking
            var len = $scope.routes.length;
            for (var i = 0; i < len; i++) {

                //Pushes the Cid, geojson, fitbound coordinates into the respective scope variables
                $scope.cidList.push($scope.routes[i].cid);
                $scope.geojsonList.push($scope.routes[i].route);
                $scope.coordinatesList.push($scope.routes[i].envelope);
                $scope.firstLoad = false;
            }
            //Loops through the number of routes retrieved to configure the relevant maps
            for (var i = 0; i < $scope.cidList.length; i++) {
                var cid = $scope.cidList[i];
                leafletData.getMap(cid).then(function(map) {
                    //Retrieving the count to retrieve the relevant geojson and fitbound
                    var count = $scope.count;
                    var geojson = $scope.geojsonList[count];
                    var coordinates = $scope.coordinatesList[count];
                    map.fitBounds(
                        coordinates, {
                            animate: true,
                            reset: true,
                            padding: [25, 25],
                            maxZoom: 16
                        }
                    );
                    L.geoJson(geojson, {
                        style: $scope.myStyle
                    }).addTo(map);
                    map.invalidateSize();
                    $scope.count = $scope.count + 1;
                })
            }
        }
    };
    //Only configures the map after the template has loaded due to some loading timing between the angular leaflet and html
    //Test whether the timeout is still required, not tested by Wee Kian
    $timeout(init, 0);

    $scope.loadMore = function() {
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getPopularRoutes",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                from: $scope.count
            }
        }).then(function successCallback(response) {
                console.log("Count: " + $scope.count);
                var additionalPopularRoutes = response.data.popularRoutes;
                console.log("Added " + additionalPopularRoutes.length + " more routes.")
                if (additionalPopularRoutes.length < 5) {
                    $scope.hasMoreRoutes = false;
                }
                $scope.routes = $scope.routes.concat(response.data.popularRoutes);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                reinit();
            },
            function errorCallback(response) {

            });
    };

    // $scope.$on('$stateChangeSuccess', function() {
    //     $scope.loadMore();
    // });

    //Can dump the route data inside here to not need to call getRoute API
    $scope.viewRoute = function(index) {
        routeName.sendData({
            index: index,
            routesType : "popularRoutes"
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
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
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
