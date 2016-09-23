angular.module('app.main.controllers')

.controller('completedCtrl', function($scope, $state, $ionicPopup, $timeout, leafletData, dataShare, $http, sharedRoute) {
    $scope.username = localStorage.getItem("username");
    sharedRoute.hasPlannedRoute = false;

    $scope.input = {
        isShared: false,
        comment: ""
    };
    angular.extend($scope, {
        tiles: {
            url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        bounds: {},
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        paths: {
            p1: {
                color: '#09493E',
                weight: 8,
                latlngs: [], //{ lat: 51.50, lng: -0.082 }
            }
        }
    });

    leafletData.getMap("cycle").then(function(map) {
        if (sharedRoute.hasPlanned) {
            map.removeLayer(sharedRoute.markerLayer);
            map.removeLayer(sharedRoute.routeLayer);
        }
    });

    var data = dataShare.getData();
    $scope.distance = parseFloat(data.distance).toFixed(2);
    $scope.duration = data.duration;
    $scope.averageSpeed = parseFloat(data.averageSpeed).toFixed(2);
    $scope.calories = data.calories;

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + " " + monthNames[today.getMonth()] + " " + yyyy;

    $scope.today = today;

    $scope.paths.p1.latlngs = data.path;

    leafletData.getMap("completed").then(function(map) {
        map.invalidateSize();
        map.fitBounds($scope.paths.p1.latlngs);
    });


    /**
     * Confirm Dialog
     */
    $scope.discard = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Discard Activity',
            template: 'Are you sure you want to discard this activity?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                dataShare.clearData();
                $state.go('tabsController.cycle');
            } else {}
        });
    };

    /**
     * Rating Stars
     */
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(255,186,73)',
        iconOffColor: 'rgb(255,186,73)',
        rating: 3,
        minRating: 1,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };

    $scope.ratingsCallback = function(rating) {
        window.plugins.toast.showWithOptions({
                message: "Rating Updated",
                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                position: "bottom",
                addPixelsY: -40 // added a negative value to move it up a bit (default 0)
            }
        );
        $scope.rating = rating;
    };
    $scope.input = {
        comment: ""
    };
    $scope.comments = [];
    $scope.postComment = function() {
            if ($scope.input.comment.length > 0) {
                $scope.comments.push({
                    dateTimeStamp: new Date().getTime(),
                    comment: $scope.input.comment
                });
                $scope.input.comment = "";
            }
        }
        /**
         * Save Button
         */
    $scope.save = function() {
        var route = $scope.paths.p1.latlngs;
        var data = dataShare.getData();
        if (route.length === 0) {
            alert("No GPS Data was received");
        } else {
            $http({
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/cycle/upload2",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    startDateTimeStamp: data.startDateTimeStamp,
                    distance: data.distance,
                    duration: data.durationInSeconds,
                    averageSpeed: data.averageSpeed,
                    calories: data.calories,
                    ratings: $scope.rating || 2,
                    route: $scope.paths.p1.latlngs,
                    generalComments: $scope.comments,
                    geotagComments: data.geotagsInfo,
                    isShared: $scope.input.isShared || false,
                    referencedCID: data.referencedCID || null
                }
            }).then(function successCallback(response) {
                dataShare.clearData();
                $state.go('tabsController.cycle');
            }, function errorCallback(response) {
                alert("Error Saving to database");
                alert(JSON.stringify(response, null, 4));
            });
        }
    };

})
