angular.module('app.main.controllers')

.controller('homeCtrl', function($scope, routeName, $state, $http, leafletData) {
    $scope.routes = {}

    // Get routeName and routeCID
    $http({
        url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getNParkRoutes",
        method: 'POST',
        async: false,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            token: localStorage.getItem("token")
        }
    }).then(function successCallback(response) {
            $scope.routes = response.data.data;

            for (var i = 0; i < $scope.routes.length; i++) {
                var counter = i;
                var routeCID = $scope.routes[i].cid;

                $.ajax({
                    dataType: 'json',
                    url: 'https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getRoute',
                    async: false,
                    method: 'POST',
                    data: {
                        cid: routeCID,
                        token: localStorage.getItem("token")
                    },
                    success: function(response) {
                        var json = response;
                        $scope.routes[counter]["geojson"] = json.route;
                        $scope.routes[counter]["distance"] = json.distance;
                        $scope.routes[counter]["duration"] = json.duration;
                        $scope.routes[counter]["noOfComments"] = json.comments.length;

                        var coordinates = JSON.parse(response.route).coordinates;

                        // Swap lat lng position for fitBounds()
                        var temp = [];
                        for (var i = 0; i < coordinates.length; i++) {
                            var temp2 = [];
                            temp2.push(coordinates[i][1]);
                            temp2.push(coordinates[i][0]);
                            temp.push(temp2);
                        }

                        coordinates = temp;

                        var geojson = JSON.parse(json.route);
                        console.log(geojson);
                        var myStyle = {
                            weight: 8,
                            opacity: 1,
                            color: '#022F40'
                        }

                        leafletData.getMap((routeCID)).then(function(map) {
                            map.fitBounds(
                                coordinates, {
                                    animate: true,
                                    reset: true,
                                    padding: [25, 25],
                                    maxZoom: 16
                                }
                            );
                            map.invalidateSize();

                            L.geoJson(geojson, {
                                style: myStyle
                            }).addTo(map);
                        })
                    }
                });
            }
            console.log($scope.routes);
        },
        function errorCallback(response) {
            console.log(JSON.stringify(response));
        })


    $scope.viewRoute = function(cid) {
        routeName.sendData(cid);
        console.log(cid);
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
