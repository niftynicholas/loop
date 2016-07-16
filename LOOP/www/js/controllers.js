angular.module('app.controllers', [])

.controller('loginCtrl', function ($scope, $state, $http) {
    $scope.input = {};
    $scope.login = function () {
        $http({
            url: "http://backendpgsql-ywk93.rhcloud.com/login",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        data:{ username: $scope.input.username, password: $scope.input.password }
        }).then(function successCallback(response) {
            alert("Success");
            $state.go('tabsController.home');
        }, function errorCallback(response) {
            alert("Error");
        });
    }
})

.controller('signupCtrl', function ($scope, $state, $http) {
    $scope.input = {};
    $scope.signUp = function () {
        $http({
            url: 'http://backendpgsql-ywk93.rhcloud.com/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { username: $scope.input.username, password: $scope.input.password, height:0, weight:0}
        }).then(function successCallback(response) {
            $state.go('login');
        }, function errorCallback(response) {

        });
    }
})

.controller('homeCtrl', function($scope) {
  $scope.options = {
    loop: true,
    effect: 'slide',
    autoplay: 2200,
  }

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    $scope.activeIndex = data.activeIndex;
    $scope.previousIndex = data.previousIndex;
  });
})

.controller('routesCtrl', function($scope) {

})

.controller('cycleCtrl', function($scope, leafletData) {
  leafletData.getMap().then(function (map) {
      /*var osmGeocoder = new L.Control.OSMGeocoder({ //search box, not very good
            collapsed: false,
            position: 'bottomright',
            text: 'Search',
      });
      osmGeocoder.addTo(map);*/
      L.Routing.control({
          waypoints: [
              L.latLng(1.3521, 103.8198),
              L.latLng(1.2997810230344622, 103.90907790873663)
          ],
          routeWhileDragging: true,
          geocoder: L.Control.Geocoder.nominatim()
      }).addTo(map);
  });

  angular.extend($scope, {
      center: {
          lat: 1.3521,
          lng: 103.8198,
          zoom: 13
          //autoDiscover: true
      },
      layers: {
          baselayers: { //hidden baselayer
              xyz: {
                  name: 'Open Cycle Map',
                  url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                  type: 'xyz',
                  layerOptions: {
                      showOnSelector: false
                  }
              }
          },
          overlays: {
              wms: {
                  name: 'EEUU States (WMS)',
                  type: 'wms',
                  visible: true,
                  url: 'http://suite.opengeo.org/geoserver/usa/wms',
                  layerParams: {
                      layers: 'usa:states',
                      format: 'image/png',
                      transparent: true
                  }
              }
          }
      },
      paths: {
          p1: {
              color: '#008000',
              weight: 8,
              latlngs: [], //{ lat: 51.50, lng: -0.082 }
              coordinates: [],
          },
          currentLoc: {
              type: 'circleMarker',
              fillColor: '#4183D7', //DarkSlateGray
              //color: '#000000',
              ///weight: 1,
              opacity: 80,
              fillOpacity: 0.9,
              stroke: false,
              clickable: false,
              latlngs: [0, 0],//1.2997810230344622, 103.90907790873663
              radius: 10
          },
          toGEOJson: {
              "type": "Point",
              "coordinates": []
          }
      },
      markers: {
          /*currentLocation: {
              lat: 1.3521,
              lng: 103.8198,
              message: "current position",
              focus: false,
              draggable: false
          },
          markerTwo: {
              lat: 1.3421,
              lng: 103.8298,
              message: "Marker Two",
              focus: true,
              draggable: true
          }*/
      },
      decorations: {
          markers: {
              coordinates: [[1.3521, 103.8100], [1.3521, 103.8200]],
              patterns: [
                      {
                          offset: '10%',
                          repeat: 0,
                          symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } })
                      }
              ]
          }
      },
      tiles: {
          url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
          options: {
              attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
          }
      }
  });

  $scope.start = function () {
      leafletData.getMap().then(function (map) {
          map.locate({ setView: true, maxZoom: 22, watch: true, enableHighAccuracy: true });
          map.on('locationfound', function (e) {
              //$scope.markers.currentLocation.lat = e.latlng.lat;
              //$scope.markers.currentLocation.lng = e.latlng.lng;
              //$scope.markers.currentLocation.message = "current position";
              //$scope.markers.currentLocation.focus = true;
              //$scope.markers.currentLocation.lng = e.latlng.lng
              $scope.paths.currentLoc.latlngs = [];
              $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
              $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
              $scope.paths.p1.latlngs.push({lat: e.latlng.lat, lng: e.latlng.lng});
              $scope.paths.p1.coordinates.push({ //storing each coordinate information
                  lat: e.latlng.lat,
                  lng: e.latlng.lng,
                  alt: e.altitude,
                  time: e.timestamp
              });
              $scope.paths.toGEOJson.coordinates.push([e.latlng.lat, e.latlng.lng]);
              alert("next GPS Ping");
          });
      });
  };
    /*
     $http({
      url: user.update_path,
      method: "POST",
      headers: {
               'Content-Type': undefined
            },
      data: {user_id: user.id, draft: true}
     });
    */

  $scope.dbConnect = function () {
      $http({
          method: 'GET',
          url: 'http://backendpgsql-ywk93.rhcloud.com/main', //?firstname=ong
          params: {firstname : 'ong'}
      }).then(function successCallback(response) {
          var test = response.data;
          for(var properties in test){
              alert(properties); //prints the properties
              alert(test[properties]); //prints the value
          }
          //****Accessing Individual Properties****
          //alert(test["firstName"]);
          //alert(test.firstName);
          //***************************************

      }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });
  };

  $scope.end = function () {
      leafletData.getMap().then(function (map) {
          map.stopLocate();
          alert($scope.paths.toGEOJson);
          alert($scope.paths.toGEOJson.type);
          alert($scope.paths.toGEOJson.coordinates);
          //var firstCoord = $scope.paths.p1.coordinates[0];
          //var lastPosition = $scope.paths.p1.coordinates.length - 1;
          //var lastCoord = $scope.paths.p1.coordinates[lastPosition];
          //alert("lat: " + firstCoord["lat"] + " | " + "lng: " + firstCoord["lng"]);
          //alert("lat: " + lastCoord["lat"] + " | " + "lng: " + lastCoord["lng"]);
          var coords = $scope.paths.p1.coordinates;
          var calculate = geolib.getPathLength($scope.paths.p1.latlngs);
          var totalElevation = 0;
          var avgElevation = 0;
          for(var i=0;i<coords.length;i++){
              var coord = coords[i];
              totalElevation += coord["alt"];
          }
          avgElevation = totalElevation / coords.length;
          alert("average elevation is: " + avgElevation);
          alert("Total Cycle Distance: " + calculate + "m");
          alert($scope.paths.p1.coordinates); //an array of hashtable [{ lat : 1.3, lng : 1.11111, alt: 123, time:1323232321 }, { lat : 1.3, lng : 1.11111, alt: 123, time:1323232321  }]
          alert("You have ended your cycle!");
      });
  };

  $scope.locate = function () {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          $scope.center.lat = position.coords.latitude;
          $scope.center.lng = position.coords.longitude;
          $scope.center.zoom = 15;
          console.log($scope.center.lat + '   ' + $scope.center.lng)
      }, function (err) {
          console.log(err)
      });
  };

  $scope.options = {
    loop: false,
    effect: 'slide',
  }

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    $scope.activeIndex = data.activeIndex;
    $scope.previousIndex = data.previousIndex;
  });
})

.controller('freeRouteCtrl', function ($scope) {

})

.controller('findRouteCtrl', function ($scope) {

})

.controller('planRouteCtrl', function ($scope) {

})

.controller('profileCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {
    $scope.height = "165 cm";
    $scope.weight = "50 kg";
})
