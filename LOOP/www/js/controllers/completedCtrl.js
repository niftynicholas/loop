angular.module('app.main.controllers')

.controller('completedCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $timeout, leafletData, dataShare, $http, sharedRoute, CONSTANTS) {
    $scope.username = localStorage.getItem("username");
    sharedRoute.hasPlannedRoute = false;

    $scope.input = {
        isShared: false,
        comment: ""
    };

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        bounds: {},
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: false
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
            sharedRoute.clearData();
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

    moment.locale();
    $scope.timeNow = moment().format('LTS');

    $scope.paths.p1.latlngs = data.path;

    leafletData.getMap("completed").then(function(map) {
        var openStreetMapWith1 = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
            attribution: '<a href="http://www.opencyclemap.org">© OpenCycleMap</a>',
            edgeBufferTiles: 2
        }).addTo(map);

        var attribution = L.control.attribution({
            position: 'bottomright'
        });

        var attributionBtn = L.easyButton({
            id: 'animated-marker-toggle',
            position: 'bottomleft',
            type: 'replace',
            states: [{
                stateName: 'show-attribution',
                icon: 'fa-info',
                title: 'Show Attribution',
                onClick: function(control) {
                    map.addControl(attribution);
                    control.state('hide-attribution');
                }
            }, {
                stateName: 'hide-attribution',
                title: 'Hide Attribution',
                icon: 'fa-times-circle',
                onClick: function(control) {
                    map.removeControl(attribution);
                    control.state('show-attribution');
                }
            }]
        });
        attributionBtn.addTo(map);

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
        });
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

    $scope.data = {};
    $scope.data.routeName = "Activity on " + $scope.today + " at " + $scope.timeNow;

    /**
     * Save Button
     */
    $scope.save = function() {
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.routeName">',
            title: 'Save Route As',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.routeName) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Opps!',
                            template: 'We do not accept blank route names.'
                        });
                    } else {
                        return $scope.data.routeName;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            if (!(typeof res === "undefined")) {
                $ionicLoading.show({
                    template: '<p>Saving...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
                });
                var route = $scope.paths.p1.latlngs;
                var data = dataShare.getData();
                if (route.length === 0) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Opps!',
                        template: 'We are unable to save this activity as there is no GPS data recorded.'
                    });
                } else {
                    $http({
                        url: CONSTANTS.API_URL + "cyclist/cycle/upload",
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
                            referencedCID: data.referencedCID || null,
                            pid: data.pid || null,
                            name: $scope.data.routeName
                        }
                    }).then(function successCallback(response) {
                        $ionicLoading.hide();
                        dataShare.clearData();
                        $state.go('tabsController.routes.myRoutes');
                    }, function errorCallback(response) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Opps!',
                            template: 'The server is currently busy. Please try again later. Sorry for any inconvenience caused.'
                        });
                    });
                }
            }
        });
    };
})
