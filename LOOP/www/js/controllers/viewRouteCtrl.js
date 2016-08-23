angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, routeName, $http, $state, dataShare) {
    $scope.routeName = '';
    $scope.distance = '';
    $scope.duration = '';
    var coordinates = [];

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
            cid: routeName.getData(),
            token: localStorage.getItem("token")
        }

    }).then(function successCallback(response) {
            console.log(response);
            console.log(response.data);
            console.log(JSON.parse(response.data.route));
            console.log(JSON.parse(response.data.route).coordinates);
            $scope.routeName = response.data.name;
            $scope.distance = response.data.distance;
            $scope.duration = response.data.duration;
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
            console.log(JSON.stringify(response));
        })

    $scope.username = localStorage.getItem("username");

    $scope.input = {
        comment: ""
    };
    $scope.OtherUserComments = [{
        user: "Venkman",
        comment: "Well Lited at night."
    }, {
        user: "Melanie",
        comment: "I love the people here!"
    }];
    $scope.comments = [];
    $scope.postComment = function() {
        if ($scope.input.comment.length > 0) {
            $scope.comments.push({
                dateTimeStamp: new Date().getTime(),
                comment: $scope.input.comment
            });
            $scope.input.comment = "";
        }
    };

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
        console.log('Selected rating is : ', rating);
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
