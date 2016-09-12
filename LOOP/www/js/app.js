// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ion-profile-picture', 'app.main.controllers', 'app.routes', 'app.directives', 'leaflet-directive', 'timer', 'ion-floating-menu', 'ionic-ratings', 'ngMessages', 'ngCordova', 'jrCrop', 'deviceGyroscope'])
    .filter('digits', function() {
        return function(input) {
            if (input < 10) input = '0' + input;

            return input;
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
            return Math.round(parseFloat(input)) + " seconds";
        } else {
            return (parseFloat(input) / 60) + " minutes";
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
    service.routeLayer = null;
    service.markerLayer = null;
    service.sourceMarker = {};
    service.targetMarker = {};
    service.routepoints = [];
    service.hasPlanned = false;

    service.clearData = function() {
        this.routeLayer = null;
        this.markerLayer = null;
        this.sourceMarker = {};
        this.targetMarker = {};
        this.routepoints = [];
        this.hasPlanned = false;
    };
    return service;
})

.factory('viewSharedRoute', function() {
    var service = {};
    service.routeLayer = null;
    service.hasPlanned = false;
    
    service.clearData = function() {
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
