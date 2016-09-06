angular.module('app.main.controllers')

.controller('routesBookmarksCtrl', function($scope, routeName, $state, $http, leafletData) {
    $scope.routes;
    var routeCID;
    var geom;

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

    $.ajax({
        dataType: 'json',
        url: 'https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getBookmarkedRoutes',
        async: false,
        method: 'POST',
        data: {
            token: localStorage.getItem("token")
        },
        success: function(response) {
            $scope.routes = response.data;
            console.log("Received " + $scope.routes.length + " routes...");

            for (var i = 0; i < $scope.routes.length; i++) {
                var route = $scope.routes[i];
                route.cid = "bookmark" + route.cid;
                geom = JSON.parse(route.geom);
                console.log("TOP");
                console.log(geom);
                console.log("Preparing drawing properties for Route CID " + route.cid + "...");

                var myStyle = {
                    weight: 8,
                    opacity: 1,
                    color: '#022F40'
                };

                var coordinates = geom.coordinates;
                var temp = [];

                for (var j = 0; j < coordinates.length; j++) {
                    var temp2 = [];
                    temp2.push(coordinates[j][1]);
                    temp2.push(coordinates[j][0]);
                    temp.push(temp2);
                }

                coordinates = temp;
                getRouteMap(route.cid, geom, myStyle, coordinates, leafletData);
            }
        }
    });

    $scope.viewRoute = function(cid) {
        routeName.sendData(cid);
        $state.go("viewRoute");
    }
})

function getRouteMap(routeCID, geom, myStyle, coordinates, leafletData) {
    leafletData.getMap(routeCID).then(function(map) {
        console.log("BOTTOM");
        console.log(geom);
        console.log("Drawing on Leaflet ID " + routeCID + "...");
        L.geoJson(geom, {
            style: myStyle
        }).addTo(map);

        map.fitBounds(
            coordinates, {
                animate: true,
                padding: [5, 5]
            }
        );
        map.invalidateSize();
    });
}
