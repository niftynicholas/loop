angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('loading', {
        url: '/loading',
        templateUrl: 'templates/loading.html',
        controller: 'loadingCtrl'
    })

    .state('landing', {
        cache: false,
        url: '/landing',
        templateUrl: 'templates/landing.html',
    })

    .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('signup', {
        cache: false,
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
    })

    .state('updateProfile', {
        cache: false,
        url: '/updateProfile',
        templateUrl: 'templates/updateProfile.html',
        controller: 'updateProfileCtrl'
    })

    .state('forgot', {
        cache: false,
        url: '/forgot',
        templateUrl: 'templates/forgot.html',
        controller: 'forgotCtrl'
    })

    .state('answer', {
        cache: false,
        url: '/answer',
        templateUrl: 'templates/answer.html',
        controller: 'answerCtrl'
    })

    .state('resetPassword', {
        cache: false,
        url: '/resetPassword',
        templateUrl: 'templates/resetPassword.html',
        controller: 'resetPasswordCtrl'
    })

    .state('tabsController', {
        url: '/tabs',
        templateUrl: 'templates/tabsController.html',
        abstract: true
    })

    .state('tabsController.home', {
        cache: false,
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
            }
        }
    })

    .state('tabsController.routes.myRoutes', {
        url: "/routesMyRoutes",
        views: {
            'routes-tab': {
                templateUrl: "templates/routesMyRoutes.html",
                controller: 'routesMyRoutesCtrl'
            }
        }
    })

    .state('tabsController.routes.nearby', {
        cache: false,
        url: "/routesNearby",
        views: {
            'routes-tab': {
                templateUrl: "templates/routesNearby.html",
                controller: 'routesNearbyCtrl'
            }
        }
    })

    .state('tabsController.routes.bookmarks', {
        cache: false,
        url: "/routesBookmarks",
        views: {
            'routes-tab': {
                templateUrl: "templates/routesBookmarks.html",
                controller: 'routesBookmarksCtrl'
            }
        }
    })

    .state('viewRoute', {
        cache: false,
        url: '/viewRoute',
        templateUrl: 'templates/viewRoute.html',
        controller: 'viewRouteCtrl'
    })

    .state('planRoute', {
        cache: false,
        url: '/planRoute',
        templateUrl: 'templates/planRoute.html',
        controller: 'planRouteCtrl'
    })

    .state('planResult', {
        cache: false,
        url: '/planResult',
        templateUrl: 'templates/planResult.html',
        controller: 'planResultCtrl'
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

    $urlRouterProvider.otherwise('/loading')
});
