angular.module('app.main.controllers')

.controller('routesBookmarksCtrl', function($scope, routeName, $state, $http, leafletData, $timeout, CONSTANTS) {
    //Retrieves and parses the popularRoutes that was retrieved when the user logged in
    $scope.routes = JSON.parse(localStorage.getItem("bookmarkedRoutes"));

    $scope.routeComments = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
    $scope.$on('$ionicView.enter', function(){
        $scope.routeComments = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
    });

    $scope.hasMoreRoutes = true;
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
            url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                to: $scope.count
            }
        }).then(function successCallback(response) {
            $scope.routes = response.data.bookmarkedRoutes;
            $scope.routeComments = response.data.bookmarkedRoutes;
            localStorage.setItem("bookmarkedRoutes", JSON.stringify($scope.routes));
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
        console.log("called init");
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
            console.log("called loadMore");
            $http({
                url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    from: $scope.count
                }
            }).then(function successCallback(response) {
                var additionalBookmarkedRoutes = response.data.bookmarkedRoutes;
                if (additionalBookmarkedRoutes.length < 10) {
                    $scope.hasMoreRoutes = false;
                }
                $scope.routes = $scope.routes.concat(response.data.bookmarkedRoutes);
                $scope.routeComments = $scope.routeComments.concat(response.data.bookmarkedRoutes);
                localStorage.setItem("bookmarkedRoutes", JSON.stringify($scope.routes));
                $scope.$broadcast('scroll.infiniteScrollComplete');
                init();
            },
            function errorCallback(response) {
                console.log("response not found");
            });
        };

        //Can dump the route data inside here to not need to call getRoute API
        $scope.viewRoute = function(index) {
            routeName.sendData({
                index: index,
                routesType : "bookmarkedRoutes"
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
                url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=" + CONSTANTS.mapbox_access_token
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
