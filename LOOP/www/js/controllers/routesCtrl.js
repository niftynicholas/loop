angular.module('app.main.controllers')

.controller('routesCtrl', function($scope, routeName, $state, $http, leafletData) {
  $scope.routes = {}

  // Get routeName and routeCID
  $http({
      url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getBookmarkedRoutes",
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
    console.log(response.data.data.length);
    for (var i = 0; i < response.data.data.length; i++) {
      var routeCID = response.data.data[i].cid;
      var geom = JSON.parse(response.data.data[i].geom);
      var c = geom.coordinates;

      var temp = [];
      for (var j = 0; j < c.length; j++) {
        var temp2 = [];
        temp2.push(c[j][1]);
        temp2.push(c[j][0]);
        temp.push(temp2);
      }
      var coordinates = temp;
      var myStyle = {
          weight: 8,
          opacity: 1,
          color: '#022F40'
      }
      //console.log(JSON.stringify(coordinates));
      leafletData.getMap(routeCID).then(function(map) {
          map.fitBounds(
               coordinates, {
                  animate: true,
                  reset: true,
                  padding: [25, 25],
                  maxZoom: 16
              }
          );
          map.invalidateSize();

          L.geoJson(geom, {
              style: myStyle
          }).addTo(map);

      })
    }
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
