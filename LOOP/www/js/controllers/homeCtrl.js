angular.module('app.main.controllers')

.controller('homeCtrl', function($scope, homeData, routeName, $state, $http, $timeout, $parse, leafletData) {

    //Retrieves and parses the popularRoutes that was retrieved when the user logged in
    $scope.routes = JSON.parse(localStorage.getItem("popularRoutes"));
    $scope.routeComments = JSON.parse(localStorage.getItem("popularRoutes"));
    $scope.hasMoreRoutes = true;
    $scope.$on('$ionicView.enter', function(){
      $scope.routeComments = JSON.parse(localStorage.getItem("popularRoutes"));
    });
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
    }
    var init = function() {
        if ($scope.firstLoad) {

            //Loops through the number of routes retrieved to configure the relevant maps
            for (var i = 0; i < $scope.routes.length; i++) {
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
                var additionalPopularRoutes = response.data.popularRoutes;
                if (additionalPopularRoutes.length < 5) {
                    $scope.hasMoreRoutes = false;
                }
                $scope.routes = $scope.routes.concat(response.data.popularRoutes);
                localStorage.setItem("popularRoutes", JSON.stringify($scope.routes));
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
