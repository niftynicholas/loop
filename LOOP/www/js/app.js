// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'leaflet-directive', 'timer', 'ion-floating-menu', 'ionic-ratings', 'ngMessages'])
    .filter('digits', function() {
        return function(input) {
            if (input < 10) input = '0' + input;

            return input;
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

.factory('routeName',function(){
    var service = {};
    service.data = false;
    service.sendData = function (data) {
        this.data = data;
    };
    service.getData = function () {
        return this.data;
    };
    service.clearData = function () {
        this.data = false;
    };
    return service;
})

.factory('sharedRoute', function () {
    var service = {};
    service.data = false;
    service.sendData = function (data) {
        this.data = data;
    };
    service.getData = function () {
        return this.data;
    };
    service.clearData = function () {
        this.data = false;
    };
    return service;
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center')
})

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
