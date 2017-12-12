'use strict';

// Change appName using your own app name
angular.module('payeSAM', [
  'ngRoute',
  'ngResource',
  'ngSanitize',

  'ui.bootstrap',
  'ui.select',
  // 'ngAnimate',
  'LocalStorageModule',
  'angular-growl',
  'templates',
  'NgSwitchery',

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
var isProd = (window.location.host === 'auditoriavdc.com.ar');
var originUrl = isProd ? 'http://auditoriavdc.com.ar' : 'http://localhost:9292';

angular.module('payeSAM')
  .constant('originUrl',  originUrl)
  .constant('apiUrl', originUrl + '/api/v1')
  .constant('paginationLimit', 10)
  .constant('rootURL', '/dashboard')
  .constant('adminRootURL', '/dashboard');

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
      .when('/patients', {
        templateUrl: 'views/patients.html',
        controller: 'PatientCtrl'
      })
      .when('/services', {
        templateUrl: 'views/services/index.html',
        controller: 'ServiceCtrl'
      })
      .when('/services/:id', {
        templateUrl: 'views/services/show.html',
        controller: 'ServiceShowCtrl'
      })
      .when('/service_audits', {
        templateUrl: 'views/service_audits/index.html',
        controller: 'ServiceAuditCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      // ADMIN ROUTES
      .when('/admin/dashboard', {
        controller: 'AdminDashboardCtrl',
        templateUrl: 'views/admin/dashboard.html',
        data: {
          roles: 'Admin'
        }
      })
      .when('/admin/users', {
        controller: 'AdminUserCtrl',
        templateUrl: 'views/admin/user.html',
        data: {
          roles: 'Admin'
        }
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

  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      // Check if current user has group access
      var role = next.$$route.data && next.$$route.data.roles;
      if(role && role !== $rootScope.currentUser.user_type) {
         $location.path('/');
      }
    });
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

    $rootScope.validatorLabel = function (key) {
      var msg = {
        'not_present': 'Es requerido.',
        'not_numeric': 'No es número.',
        'format': 'Formato Inválido.',
        'not_in_range': 'Longitud Inválida.',
        'not_equal': 'No es igual.',
        'can_create_new_service': 'No puede tener mas de 1 prestación en progreso'
      };
      return msg[key];
    };
  }]);
