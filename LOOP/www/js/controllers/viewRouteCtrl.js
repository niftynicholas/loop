angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, routeName, $http, $state, dataShare, viewSharedRoute) {
    $scope.username = localStorage.getItem("username");
    var index = routeName.getData().index;
    var routesType = routeName.getData().routesType;
    var routes = JSON.parse(localStorage.getItem(routesType));
    $scope.route = routes[index];
    //console.log(JSON.stringify($scope.route, null, 4));
    $scope.stars = Math.round($scope.route.ratings);
    $scope.ratings = $scope.route.ratings + "";
    $scope.readOnly = true;
    $scope.input = {
      comment : ""
    }

    $scope.input = {
        comment: ""
    };

    $scope.postComment = function() {
        if ($scope.input.comment.length > 0) {
            if ($scope.route.comments === null) {
              $scope.route.comments = [{
                comment: $scope.input.comment,
                username: $scope.username
              }];
            } else {
              $scope.route.comments.push({
                  comment: $scope.input.comment,
                  username: $scope.username
              });
            }
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/comment/addComment",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    cid: $scope.route.cid,
                    token: localStorage.getItem("token"),
                    comment: {
                        comment:$scope.input.comment,
                        username:$scope.username,
                        dateTimeStamp:new Date().getTime()
                    }
                }

            }).then(function successCallback(response) {
                  console.log("success");
            },
            function errorCallback(response) {
                  console.log("error with sending http request for posting comment to server");
            });
            $scope.input.comment = "";
            updateRoute();
        }
    };
    /*
    var index = routeName.getData().index;
    var routesType = routeName.getData().routesType;
    var routes = JSON.parse(localStorage.getItem(routesType));
    $scope.route = routes[index];
    */
    var updateRoute = function() {
      var popularRoutes = JSON.parse(localStorage.getItem("popularRoutes"));
      for (var i = 0; i < popularRoutes.length; i++) {
          var current = popularRoutes[i];
          if (current.cid === $scope.route.cid) {
            popularRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("popularRoutes", JSON.stringify(popularRoutes));

      var bookmarkedRoutes = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
      for (var i = 0; i < bookmarkedRoutes.length; i++) {
          var current = bookmarkedRoutes[i];
          if (current.cid === $scope.route.cid) {
            bookmarkedRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("bookmarkedRoutes", JSON.stringify(bookmarkedRoutes));

      var userRoutes = JSON.parse(localStorage.getItem("userRoutes"));
      for (var i = 0; i < userRoutes.length; i++) {
          var current = userRoutes[i];
          if (current.cid === $scope.route.cid) {
            userRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("userRoutes", JSON.stringify(userRoutes));
    };

    var addBookmark = function() {
      var bookmarkedRoutes = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
      //console.log(JSON.stringify(bookmarkedRoutes, null, 4));
      bookmarkedRoutes.unshift($scope.route);
      localStorage.setItem("bookmarkedRoutes", JSON.stringify(bookmarkedRoutes));
      //console.log(JSON.stringify(bookmarkedRoutes, null, 4));
      var popularRoutes = JSON.parse(localStorage.getItem("popularRoutes"));
      for (var i = 0; i < popularRoutes.length; i++) {
          var current = popularRoutes[i];
          if (current.cid === $scope.route.cid) {
            popularRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("popularRoutes", JSON.stringify(popularRoutes));

      var userRoutes = JSON.parse(localStorage.getItem("userRoutes"));
      for (var i = 0; i < userRoutes.length; i++) {
          var current = userRoutes[i];
          if (current.cid === $scope.route.cid) {
            userRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("userRoutes", JSON.stringify(userRoutes));
    };

    var removeBookmark = function() {
      var bookmarkedRoutes = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
      console.log(JSON.stringify(bookmarkedRoutes.length));
      for (var i = 0; i < bookmarkedRoutes.length ; i++) {
        var current = bookmarkedRoutes[i];
        if (current.cid === $scope.route.cid) {
          bookmarkedRoutes.splice(i, 1);
          break;
        }
      }
      console.log(JSON.stringify(bookmarkedRoutes.length));
      localStorage.setItem("bookmarkedRoutes", JSON.stringify(bookmarkedRoutes));

      var popularRoutes = JSON.parse(localStorage.getItem("popularRoutes"));
      for (var i = 0; i < popularRoutes.length; i++) {
          var current = popularRoutes[i];
          if (current.cid === $scope.route.cid) {
            popularRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("popularRoutes", JSON.stringify(popularRoutes));

      var userRoutes = JSON.parse(localStorage.getItem("userRoutes"));
      for (var i = 0; i < userRoutes.length; i++) {
          var current = userRoutes[i];
          if (current.cid === $scope.route.cid) {
            userRoutes[i] = $scope.route;
            break;
          }
      }
      localStorage.setItem("userRoutes", JSON.stringify(userRoutes));
    };


    leafletData.getMap("viewRoute").then(function(map) {
        var osmUrl = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
        osmAttrib = 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>',
        osm = L.tileLayer(osmUrl, {maxZoom: 17, attribution: osmAttrib, rotate:true, edgeBufferTiles: 2});
        map.addLayer(osm);

        map.fitBounds(
            $scope.route.envelope, {
                animate: true,
                reset: true,
                padding: [25, 25],
                maxZoom: 16
            }
        );
        map.invalidateSize();
    })

    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(255,186,73)',
        iconOffColor: 'rgb(255,186,73)',
        rating: $scope.stars,
        minRating: 0,
        readOnly: true,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };

    $scope.ratingsCallback = function(rating) {
        $scope.rating = rating;
    };


    $scope.cycle = function() {
        viewSharedRoute.routeLayer = $scope.route.route;
        viewSharedRoute.hasPlanned = true;
        $state.go("inprogress");
    }

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.bookmark = function() {
      if ($scope.route.isbookmarked === false) {
        $scope.route.isbookmarked = true;
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/bookmark",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                cid: $scope.route.cid,
                dateTimeStamp: new Date().getTime()
            }
        }).then(function successCallback(response) {
            },
            function errorCallback(response) {
            })
        addBookmark();
      } else {
        $scope.route.isbookmarked = false;
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/removeBookmark",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                cid: $scope.route.cid
            }
        }).then(function successCallback(response) {
            },
            function errorCallback(response) {
            })
            removeBookmark();
      }
      updateRoute();
    }

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        geojson: {
            data: $scope.route.route,
            style: {
                weight: 8,
                opacity: 1,
                color: '#09493E'
            }
        }
    });
})
