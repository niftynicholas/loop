angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, routeName, $http, $state, dataShare) {
    $scope.username = localStorage.getItem("username");
    $scope.routeName = '';
    $scope.distance = '';
    $scope.duration = '';
    $scope.ratings ='';
    var coordinates = [];
    var routeCID = routeName.getData();

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
        }
    });

    $http({
        url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/getRoute",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            cid: routeCID,
            token: localStorage.getItem("token")
        }

    }).then(function successCallback(response) {
            $scope.routeName = response.data.name;
            $scope.distance = response.data.distance;
            $scope.duration = response.data.duration;
            $scope.comments = response.data.comments;
            $scope.isbookmarked = response.data.isbookmarked;
            $scope.ratings = parseFloat(response.data.ratings).toFixed(2);
            coordinates = JSON.parse(response.data.route).coordinates;
            angular.extend($scope, {
                geojson: {
                    data: JSON.parse(response.data.route),
                    style: {
                        weight: 8,
                        opacity: 1,
                        color: '#022F40'
                    }
                }
            });

            var temp = [];
            for (var i=0;i < coordinates.length;i++) {
                var temp2 = [];
                temp2.push(coordinates[i][1]);
                temp2.push(coordinates[i][0]);
                temp.push(temp2);
            }

            coordinates = temp;

            leafletData.getMap("viewRoute").then(function(map) {
                map.fitBounds(
                    coordinates, {
                        animate: true,
                        reset: true,
                        padding: [25, 25],
                        maxZoom: 16
                    }
                );
                map.invalidateSize();
            })
        },
        function errorCallback(response) {
        })

    $scope.username = localStorage.getItem("username");

    $scope.input = {
        comment: ""
    };
    $scope.comments = [];
    $scope.postComment = function() {
        if ($scope.input.comment.length > 0) {
            $scope.comments.push({
                dateTimeStamp: new Date().getTime(),
                comment: $scope.input.comment,
                username: $scope.username
            });
            $scope.input.comment = "";
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/comment/addComment",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    cid: routeName.getData(),
                    token: localStorage.getItem("token"),
                    comment: $scope.comments[$scope.comments.length-1]
                }

            }).then(function successCallback(response) {
                  console.log("success");
              },
              function errorCallback(response) {
                  console.log("error with sending http request for posting comment to server");
              });
        }
    };

    $scope.bookmark = function() {
      if ($scope.isbookmarked === false) {
        $scope.isbookmarked = true;
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/bookmark",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                cid: routeCID
            }
        }).then(function successCallback(response) {
            },
            function errorCallback(response) {
            })
      } else {
        $scope.isbookmarked = false;
        $http({
            url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/route/removeBookmark",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                token: localStorage.getItem("token"),
                cid: routeCID
            }
        }).then(function successCallback(response) {
            },
            function errorCallback(response) {
            })
      }
    }

    /**
     * Rating Stars
     */
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(255,186,73)',
        iconOffColor: 'rgb(255,186,73)',
        rating: 2,
        minRating: 1,
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
})
