angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        paths: {
            currentLoc: {
                type: 'circleMarker',
                fillColor: '#4183D7', //DarkSlateGray
                //color: '#000000',
                ///weight: 1,
                opacity: 80,
                fillOpacity: 0.9,
                stroke: false,
                clickable: false,
                latlngs: [0, 0], //1.2997810230344622, 103.90907790873663
                radius: 10
            },
        },
        tiles: {
            //url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q"
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        }
    });

    leafletData.getMap("pcn").then(function(map) {
        setInterval(function() {
            map.invalidateSize();
        }, 3000); //every 3s
        map.locate({
            watch: true,
            enableHighAccuracy: false
        });
        map.on('locationfound', function(e) {
            $scope.currentLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            if ($scope.firstLoad) {
                map.setView($scope.currentLocation, 16);
                $scope.firstLoad = false;
            }
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
        });
        map.on('locationerror', function(e) {
            console.log('Location access denied.');
        });
    });

    $scope.locateMe = function() {
        leafletData.getMap("pcn").then(function(map) {
            map.setView($scope.currentLocation);
        });
    }


    //
    // leafletData.getMap("pcn").then(function(map) {
    //     // var track = new L.KML("js/Park_Connector_Loop.kml", {
    //     //     async: true
    //     // });
    //     // track.on("loaded", function(e) {
    //     //     map.fitBounds(e.target.getBounds());
    //     // });
    //     // map.addLayer(track);
    //     // map.addControl(new L.Control.Layers({}, {
    //     //     'Park Connector Network': track
    //     // }));
    //
    //     var customLayer = L.geoJson(null, {
    //         // http://leafletjs.com/reference.html#geojson-style
    //         style: function(feature) {
    //             return {
    //                 color: '#0d5e4e'
    //             };
    //         }
    //     });
    //
    //     omnivore.geojson('js/Park_Connector_Loop.geojson', null, customLayer).addTo(map);
    //
    //     map.addControl(new L.Control.Layers({}, {
    //         'Park Connector Network': customLayer
    //     }));
    // });
})
