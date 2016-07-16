angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
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

  .state('tabsController.routes', {
    url: '/routes',
    views: {
      'tab2': {
        templateUrl: 'templates/routes.html',
        controller: 'routesCtrl'
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

   .state('findRoute', {
       url: '/findRoute',
       templateUrl: 'templates/findRoute.html',
       controller: 'findRouteCtrl'
   })

   .state('planRoute', {
       url: '/planRoute',
       templateUrl: 'templates/planRoute.html',
       controller: 'planRouteCtrl'
   })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab4': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })


$urlRouterProvider.otherwise('/login')

});
