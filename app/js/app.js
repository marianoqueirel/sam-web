'use strict';

// Change appName using your own app name
angular.module('payeSAM', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  // 'ngAnimate',
  'LocalStorageModule',
  'angular-growl',
  'templates',

  // App
  'payeSAM.factories',
  'payeSAM.filters',
  'payeSAM.services',
  'payeSAM.directives',
  'payeSAM.controllers'
]);

angular.module('payeSAM.controllers', []);
angular.module('payeSAM.directives', []);
angular.module('payeSAM.services', []);
angular.module('payeSAM.filters', []);
angular.module('payeSAM.factories', []);

// Config constans
var isProd = (window.location.host === 'staging.sam.com.ar');
var originUrl = isProd ? 'http://staging.sam.com.ar' : 'http://localhost:9292';

angular.module('payeSAM')
  .constant('originUrl',  originUrl)
  .constant('apiUrl', originUrl + '/api/v1')
  .constant('paginationLimit', 20)
  .constant('rootURL', '/dashboard');

// Config Routes
angular.module('payeSAM')
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/profile/edit', {
        templateUrl: 'views/profile/edit.html',
        controller: 'ProfileEditCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'SessionCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'RegisterCtrl'
      })
      .when('/providers', {
        templateUrl: 'views/providers.html',
        controller: 'ProviderCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({ redirectTo: '/404' });

    // Set HTML5 mode
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);

  }])

  .run(['$rootScope', '$location', '$http', 'localStorageService', function ($rootScope, $location, $http, localStorageService) {

    var authUrl = '/login';
    var user = localStorageService.get('currentUser');

    if (user) {
      var currentTime = +(new Date()),
        timeDiff = user.timeout - currentTime;

      if (timeDiff > 0) {
        $rootScope.currentUser = user;

        $http.defaults.headers.common['X-PAYE-SAM-ACCESS-TOKEN'] = user.access_token;

        $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
          var location = $location.path();

          // currentUser exist?, location != login?
          if ( ! $rootScope.currentUser && location !== '/login') {
            $location.path(authUrl);
          }
        });
      } else {
        localStorageService.remove('currentUser');
        delete $rootScope.currentUser;

        $location.path(authUrl);
      }
    } else {
      if ($location.path() !== '/login' || $location.path() !== '/signup') {
        $location.path(authUrl);
      }
    }
  }])

  // user permissions
  .run(['$rootScope', function ($rootScope) {
    var _accessLevel = function (role) {
      var levels = {
        superadmin: 0,
        admin: 10,
        operator: 20
      };

      return levels[role];
    };

    $rootScope.requirePermission = function (role) {
      if ($rootScope.currentUser) return _accessLevel($rootScope.currentUser.role) <= _accessLevel(role);

      return false;
    };
  }]);
