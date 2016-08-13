angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
    })

    .state('verify', {
        url: '/verify',
        templateUrl: 'templates/verify.html',
        controller: 'verifyCtrl'
    })

    .state('forgot', {
        url: '/forgot',
        templateUrl: 'templates/forgot.html',
        controller: 'forgotCtrl'
    })

    .state('tabsController', {
        url: '/tabs',
        templateUrl: 'templates/tabsController.html',
        abstract: true
    })

    .state('tabsController.home', {
        url: '/home',
        views: {
            'tab1': {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            }
        }
    })

    .state('tabsController.pcn', {
        url: '/pcn',
        views: {
            'tab5': {
                templateUrl: 'templates/pcn.html',
                controller: 'pcnCtrl'
            }
        }
    })

    .state('tabsController.cycle', {
        url: '/cycle',
        views: {
            'tab3': {
                templateUrl: 'templates/cycle.html',
                controller: 'cycleCtrl'
            }
        }
    })

    .state('freeRoute', {
        url: '/freeRoute',
        templateUrl: 'templates/freeRoute.html',
        controller: 'freeRouteCtrl'
    })

    .state('inprogress', {
        cache: false,
        url: '/inprogress',
        templateUrl: 'templates/inprogress.html',
        controller: 'inprogressCtrl'
    })

    .state('completed', {
        cache: false,
        url: '/completed',
        templateUrl: 'templates/completed.html',
        controller: 'completedCtrl'
    })

    .state('tabsController.routes', {
        url: '/routes',
        views: {
            'tab2': {
                templateUrl: 'templates/routes.html',
                controller: 'routesCtrl'
            }
        }
    })

    .state('viewRoute', {
        url: '/viewRoute',
        templateUrl: 'templates/viewRoute.html',
        controller: 'viewRouteCtrl'
    })

    .state('selectRoute', {
        url: '/selectRoute',
        templateUrl: 'templates/selectRoute.html',
        controller: 'selectRouteCtrl'
    })

    .state('findRoute', {
        url: '/findRoute',
        templateUrl: 'templates/findRoute.html',
        controller: 'findRouteCtrl'
    })

    .state('planRoute', {
        cache: false,
        url: '/planRoute',
        templateUrl: 'templates/planRoute.html',
        controller: 'planRouteCtrl'
    })

    .state('tabsController.profile', {
        cache: false,
        url: '/profile',
        views: {
            'tab4': {
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            }
        }
    })

    .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'templates/changePassword.html',
        controller: 'changePasswordCtrl'
    })

    .state('editProfile', {
        cache: false,
        url: '/editProfile',
        templateUrl: 'templates/editProfile.html',
        controller: 'editProfileCtrl'
    })

    $urlRouterProvider.otherwise('/login')
});
