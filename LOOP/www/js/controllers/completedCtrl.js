angular.module('app.main.controllers')

.controller('completedCtrl', function($scope, $state, $ionicPopup, $timeout, leafletData, dataShare, $http, sharedRoute) {
    $scope.username = localStorage.getItem("username");
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
                color: '#008000',
                weight: 8,
                latlngs: [], //{ lat: 51.50, lng: -0.082 }
            }
        }
    });

    sharedRoute.sendData(new L.FeatureGroup());

    var data = dataShare.getData();
    $scope.distance = data.distance;
    $scope.duration = data.duration;
    $scope.averageSpeed = data.averageSpeed;
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
                console.log('You are sure');
                dataShare.clearData();
                $state.go('tabsController.cycle');
            } else {
                console.log('You are not sure');
            }
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
        rating: 2,
        minRating: 1,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };

    $scope.ratingsCallback = function(rating) {
        //console.log('Selected rating is : ', rating);
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
                url: "https://sgcycling-sgloop.rhcloud.com/api/cyclist/cycle/upload",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    token: localStorage.getItem("token"),
                    startDateTimeStamp: new Date().getMilliseconds(), //Need the datetimestamp from the start of clicking the start activity
                    distance: data.distance,
                    duration: data.durationInMillis,
                    averageSpeed: data.averageSpeed,
                    calories: data.calories,
                    ratings: $scope.rating || 2,
                    route: $scope.paths.p1.latlngs,
                    generalComments: $scope.comments,
                    isShared: $scope.input.isShared || false
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
