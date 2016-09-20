angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, $ionicPopup, routeName, $http, $state, dataShare, viewSharedRoute) {
    $scope.username = localStorage.getItem("username");
    $scope.profilePictures = JSON.parse(localStorage.getItem("profilePictures"));
    var uid = localStorage.getItem("uid");
    var index = routeName.getData().index;
    var routesType = routeName.getData().routesType;
    var routes = JSON.parse(localStorage.getItem(routesType));
    $scope.route = routes[index];
    $scope.stars = Math.round($scope.route.ratings);
    $scope.ratings = $scope.route.ratings + "";
    $scope.readOnly = true;
    $scope.input = {
        comment: ""
    };

    $scope.postComment = function() {
        if ($scope.input.comment.length > 0) {
            if ($scope.route.comments === null) {
                $scope.route.comments = [{
                    uid : uid,
                    comment: $scope.input.comment,
                    username: $scope.username
                }];
            } else {
                $scope.route.comments.push({
                    uid : uid,
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
                        comment: $scope.input.comment,
                        username: $scope.username,
                        dateTimeStamp: new Date().getTime()
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
        bookmarkedRoutes.unshift($scope.route);
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

    var removeBookmark = function() {
        var bookmarkedRoutes = JSON.parse(localStorage.getItem("bookmarkedRoutes"));
        for (var i = 0; i < bookmarkedRoutes.length; i++) {
            var current = bookmarkedRoutes[i];
            if (current.cid === $scope.route.cid) {
                bookmarkedRoutes.splice(i, 1);
                break;
            }
        }
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
        osm = L.tileLayer(osmUrl, {
            maxZoom: 17,
            attribution: osmAttrib,
            rotate: true,
            edgeBufferTiles: 2
        });
        map.addLayer(osm);

        if($scope.route.envelope.length == 2){
            map.setView($scope.route.envelope, 16);
        }else{
            map.fitBounds(
                $scope.route.envelope, {
                    animate: true,
                    reset: true,
                    padding: [25, 25],
                    maxZoom: 16
                }
            );
        }
        L.geoJson($scope.route.route, {
            style: {
                weight: 8,
                opacity: 1,
                color: '#09493E'
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 2,
                    fillColor: "#09493E",
                    color: "#09493E",
                    opacity: 1});
                }
            }).addTo(map);
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
            //  Show Popup
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cycle Route',
                template: 'Are you sure you would like to cycle this route?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    viewSharedRoute.startDateTimeStamp = new Date().getTime();
                    viewSharedRoute.cid = $scope.route.cid;
                    viewSharedRoute.routeLayer = $scope.route.route;
                    viewSharedRoute.hasPlanned = true;
                    $state.go("inprogress");

                } else {
                    console.log('Cancelled');
                }
            });
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
                }).then(function successCallback(response) {},
                function errorCallback(response) {})
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
                }).then(function successCallback(response) {},
                function errorCallback(response) {})
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
            }
        });
    })
