// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'ion-profile-picture', 'app.main.controllers', 'app.routes', 'app.directives', 'leaflet-directive', 'timer', 'ion-floating-menu', 'ionic-ratings', 'ngMessages', 'ngCordova', 'jrCrop', 'ionic-numberpicker', 'ng-walkthrough', 'ionic-modal-select'])
.constant('CONSTANTS', {
    API_URL: "https://sgcycling-sgloop.rhcloud.com/api/",
    VERSION: "0.0.7",
    mapbox_access_token: "pk.eyJ1Ijoic2dsb29wYXBwbGljYXRpb24iLCJhIjoiY2lydnoxN3ZxMGlpdGZmbTYzOWU5NTF6biJ9.ylXvnapNFigSQ_r4768y5Q"
    //Mapbox Access Token For Deployment: pk.eyJ1Ijoic2dsb29wYXBwbGljYXRpb24iLCJhIjoiY2lydnoxN3ZxMGlpdGZmbTYzOWU5NTF6biJ9.ylXvnapNFigSQ_r4768y5Q
    //Mapbox Access Token For Testing & Development: pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q
})

.filter('digits', function() {
    return function(input) {
        if (input < 10) input = '0' + input;

        return input;
    }
})

.filter('toFixed2', function() {
    return function(input) {
        return parseFloat(input).toFixed(2);
    }
})

.filter('km', function() {
    return function(input) {
        return (parseFloat(input) / 1000).toFixed(2);
    }
})

.filter('duration', function() {
    return function(input) {
        if (input < 60) {
            return Math.round(parseFloat(input)).toFixed(2) + " s";
        } else {
            return (parseFloat(input) / 60).toFixed(2) + " min";
        }
    }
})

.factory('dataShare', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('shareUsername', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('sharePassword', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('shareToken', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('mapData', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('securityQnsData', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('homeData', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('routeName', function() {
    var service = {};
    service.data = false;
    service.sendData = function(data) {
        this.data = data;
    };
    service.getData = function() {
        return this.data;
    };
    service.clearData = function() {
        this.data = false;
    };
    return service;
})

.factory('sharedRoute', function() {
    var service = {};
    service.hasPlannedRoute = false;
    service.routeLayer = null;
    service.markerLayer = null;
    service.sourceMarker = {};
    service.targetMarker = {};
    service.routepoints = null;
    service.hasPlanned = false;

    service.clearData = function() {
        this.routeLayer = null;
        this.markerLayer = null;
        this.sourceMarker = {};
        this.targetMarker = {};
        this.routepoints = null;
        this.hasPlanned = false;
    };
    return service;
})

.factory('viewSharedRoute', function() {
    var service = {};
    service.cid = null;
    service.startDateTimeStamp = null;
    service.routeLayer = null;
    service.hasPlanned = false;

    service.clearData = function() {
        this.cid = null;
        this.startDateTimeStamp = null;
        this.routeLayer = null;
        this.hasPlanned = false;
    };
    return service;
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center')
})

// .config(function($ionicNativeTransitionsProvider){
//     $ionicNativeTransitionsProvider.setDefaultTransition({
//         type: 'fade',
//         duration: 500
//     });
// })
//
// .config(function($ionicNativeTransitionsProvider){
//     $ionicNativeTransitionsProvider.setDefaultBackTransition({
//         type: 'slide',
//         direction: 'right'
//     });
// })

.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function() {
                    console.warn('Location permission is not turned on');
                }

                permissions.requestPermission(
                    permissions.ACCESS_COARSE_LOCATION,
                    function(status) {
                        if (!status.hasPermission) errorCallback();
                    },
                    errorCallback);
            }
        }

        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function() {
                    console.warn('Location permission is not turned on');
                }

                permissions.requestPermission(
                    permissions.ACCESS_FINE_LOCATION,
                    function(status) {
                        if (!status.hasPermission) errorCallback();
                    },
                    errorCallback);
            }
        }

        permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function() {
                    console.warn('Location permission is not turned on');
                }

                permissions.requestPermission(
                    permissions.CAMERA,
                    function(status) {
                        if (!status.hasPermission) errorCallback();
                    },
                    errorCallback);
            }
        }

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
