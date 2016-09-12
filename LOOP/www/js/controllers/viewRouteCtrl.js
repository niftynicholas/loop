angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, routeName, $http, $state, dataShare) {
    $scope.username = localStorage.getItem("username");
    $scope.route = routeName.getData().route;
    //console.log(JSON.stringify($scope.route, null, 4));
    $scope.stars = Math.round($scope.route.ratings);
    $scope.ratings = $scope.route.ratings + "";
    $scope.readOnly = true;
    $scope.input = {
      comment : ""
    }


    leafletData.getMap("viewRoute").then(function(map) {
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
        dataShare.sendData(coordinates);
        $state.go("cycle");
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
      }
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
            scrollWheelZoom: true,
            zoomControl: true
        },
        geojson: {
            data: $scope.route.route,
            style: {
                weight: 8,
                opacity: 1,
                color: '#022F40'
            }
        }
    });
})
    /*



    /**
     * Rating Stars
     *//*

})*/
