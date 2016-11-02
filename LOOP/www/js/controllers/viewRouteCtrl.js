angular.module('app.main.controllers')

.controller('viewRouteCtrl', function($scope, leafletData, $ionicHistory, $ionicPopup, routeName, $http, $state, dataShare, viewSharedRoute, $ionicPopup, $ionicModal, $ionicLoading, CONSTANTS, shareUsername, sharePassword, shareToken) {
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
    var tempDateTimeStamp = "";
    $scope.coid;

    $scope.postComment = function() {
        $ionicLoading.show({
            template: '<p>Posting...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        })
        var dts = new Date().getTime();
        if ($scope.input.comment.length > 0) {
            $http({
                url: CONSTANTS.API_URL + "cyclist/comment/addComment",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    cid: $scope.route.cid,
                    token: localStorage.getItem("token"),
                    comment: {
                        comment: $scope.input.comment,
                        dateTimeStamp: new Date().getTime()
                    }
                }

            }).then(function successCallback(response) {
                    $http({
                        url: CONSTANTS.API_URL + "cyclist/route/getPopularRoutes",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            token: localStorage.getItem("token")
                        }
                    }).then(function successCallback(response) {
                            localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                            $http({
                                url: CONSTANTS.API_URL + "cyclist/route/getUserRoutes",
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    token: localStorage.getItem("token")
                                }
                            }).then(function successCallback(response) {
                                    localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                                    $http({
                                        url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data: {
                                            token: localStorage.getItem("token")
                                        }
                                    }).then(function successCallback(response) {
                                            localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                                            $scope.input.comment = "";
                                            var routes = JSON.parse(localStorage.getItem(routesType));
                                            $scope.route = routes[index];
                                            $ionicLoading.hide();
                                        },
                                        function errorCallback(response) {
                                            $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Server Error',
                                                template: 'Unable to post comment. Please try again later.'
                                            });
                                        });
                                },
                                function errorCallback(response) {
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Server Error',
                                        template: 'Unable to post comment. Please try again later.'
                                    });
                                });
                        },
                        function errorCallback(response) {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Server Error',
                                template: 'Unable to post comment. Please try again later.'
                            });
                        });
                },
                function errorCallback(response) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Server Error',
                        template: 'Unable to post comment. Please try again later.'
                    });
                });
        }
    };

    $scope.deleteComment = function(coid) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Comment',
            template: 'Are you sure you want to delete this comment?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                $ionicLoading.show({
                    template: '<p>Deleting...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
                })
                $http({
                    url: CONSTANTS.API_URL + "cyclist/comment/deleteComment",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        coid: coid,
                        token: localStorage.getItem("token")
                    }
                }).then(function successCallback(response) {
                        $http({
                            url: CONSTANTS.API_URL + "cyclist/route/getPopularRoutes",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                token: localStorage.getItem("token")
                            }
                        }).then(function successCallback(response) {
                                localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                                $http({
                                    url: CONSTANTS.API_URL + "cyclist/route/getUserRoutes",
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        token: localStorage.getItem("token")
                                    }
                                }).then(function successCallback(response) {
                                        localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                                        $http({
                                            url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: {
                                                token: localStorage.getItem("token")
                                            }
                                        }).then(function successCallback(response) {
                                                localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                                                var routes = JSON.parse(localStorage.getItem(routesType));
                                                $scope.route = routes[index];
                                                $ionicLoading.hide();                                                
                                            },
                                            function errorCallback(response) {
                                                $ionicLoading.hide();
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Server Error',
                                                    template: 'Unable to delete comment. Please try again later.'
                                                });
                                            });
                                    },
                                    function errorCallback(response) {
                                        $ionicLoading.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Server Error',
                                            template: 'Unable to delete comment. Please try again later.'
                                        });
                                    });
                            },
                            function errorCallback(response) {
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Server Error',
                                    template: 'Unable to delete comment. Please try again later.'
                                });
                            });
                    },
                    function errorCallback(response) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Server Error',
                            template: 'Unable to delete comment. Please try again later.'
                        });
                    });
            } else {
                // User clicks No
            }
        });
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(coid, comment) {
        $scope.modal.show();
        $scope.input.edittedComment = comment;
        $scope.coid = coid;
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.editComment = function() {
        $ionicLoading.show({
            template: '<p>Saving...</p><ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>'
        })
        $http({
            url: CONSTANTS.API_URL + "cyclist/comment/editComment",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                comment: $scope.input.edittedComment,
                coid: $scope.coid,
                token: localStorage.getItem("token")
            }
        }).then(function successCallback(response) {
                $http({
                    url: CONSTANTS.API_URL + "cyclist/route/getPopularRoutes",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        token: localStorage.getItem("token")
                    }
                }).then(function successCallback(response) {
                        localStorage.setItem("popularRoutes", JSON.stringify(response.data.popularRoutes));
                        $http({
                            url: CONSTANTS.API_URL + "cyclist/route/getUserRoutes",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                token: localStorage.getItem("token")
                            }
                        }).then(function successCallback(response) {
                                localStorage.setItem("userRoutes", JSON.stringify(response.data.userRoutes));
                                $http({
                                    url: CONSTANTS.API_URL + "cyclist/route/getBookmarkedRoutes",
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        token: localStorage.getItem("token")
                                    }
                                }).then(function successCallback(response) {
                                        localStorage.setItem("bookmarkedRoutes", JSON.stringify(response.data.bookmarkedRoutes));
                                        $scope.input.comment = "";
                                        var routes = JSON.parse(localStorage.getItem(routesType));
                                        $scope.route = routes[index];
                                        $ionicLoading.hide();
                                        $scope.closeModal();
                                    },
                                    function errorCallback(response) {
                                        $ionicLoading.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Server Error',
                                            template: 'Unable to edit comment. Please try again later.'
                                        });
                                    });
                            },
                            function errorCallback(response) {
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Server Error',
                                    template: 'Unable to edit comment. Please try again later.'
                                });
                            });
                    },
                    function errorCallback(response) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Server Error',
                            template: 'Unable to edit comment. Please try again later.'
                        });
                    });
            },
            function errorCallback(response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Server Error',
                    template: 'Unable to edit comment. Please try again later.'
                });
            });
    }

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
            osmAttrib = '<a href="http://www.opencyclemap.org">© OpenCycleMap</a>',
            osm = L.tileLayer(osmUrl, {
                maxZoom: 17,
                attribution: osmAttrib,
                rotate: true,
                edgeBufferTiles: 2
            });
        map.addLayer(osm);

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

        if ($scope.route.envelope.length == 2) {
            map.setView($scope.route.envelope, 16);
        } else {
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
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 2,
                    fillColor: "#09493E",
                    color: "#09493E",
                    opacity: 1
                });
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
        //userRoutes, nearbyRoutes, bookmarkedRoutes
        if (routesType === 'nearbyRoutes') {
            $state.go('tabsController.routes.nearby');
        } else if (routesType === 'bookmarkedRoutes') {
            $state.go('tabsController.routes.bookmarks');
        } else if (routesType === 'userRoutes') {
            $state.go('tabsController.routes.myRoutes');
        } else {
            $state.go('tabsController.home');
        }
    };

    $scope.bookmark = function() {
        if ($scope.route.isbookmarked === false) {
            $scope.route.isbookmarked = true;
            $http({
                url: CONSTANTS.API_URL + "cyclist/route/bookmark",
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
                url: CONSTANTS.API_URL + "cyclist/route/removeBookmark",
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
            zoomControl: true,
            attributionControl: false
        }
    });
})
