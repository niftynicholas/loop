angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData) {
    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
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
