angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, routeName, $http) {
    $scope.routeName = '';
    var routeName = routeName.getData();
    console.log(routeName);
    $scope.routeName = routeName;

    $scope.username = localStorage.getItem("username");
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

    // Get the countries geojson data from a JSON
    $http.get("https://sgcycling-sgloop.rhcloud.com/api/cyclist/cycle/route?route=Southern%20Ridges%20Loop").success(function(data, status) {
        angular.extend($scope, {
            geojson: {
                data: data.data,
                style: {
                    weight: 8,
                    opacity: 1,
                    color: '#10735F',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });
    });

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

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };
})
