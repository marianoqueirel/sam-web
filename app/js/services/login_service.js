'use strict';

angular.module('payeSAM.services')
  .factory('LoginService', ['$rootScope', '$http', 'apiUrl', 'localStorageService', 'notification', '$location',
    function($rootScope, $http, apiUrl, localStorageService, notification, $location) {

      var loginUrl = apiUrl + '/auth/login';
      var isAuthenticated = false;
        return {
          login : function(username, password) {
          $rootScope.loading = true;
          $http
            .post(loginUrl,{username: username, password: password})
            .then(
              function (response) {
                isAuthenticated = response.data.authenticated;
                $http.defaults.headers.common['X-CHEQUESGRAM-ACCESS-TOKEN'] = response.data.user.access_token;
                $rootScope.currentUser = response.data.user;
                $rootScope.currentUser.timeout = +(new Date()) + 14400000;
                localStorageService.add('currentUser', response.data.user);
                $rootScope.loading = false;
                $location.path('/');
              },
              function(response) {
                $rootScope.loading = false;
                notification.error('El correo electrónico que ingresaste no coinciden con ninguna cuenta.');
              }
            );
          return isAuthenticated;
        },
        isAuthenticated : function() {
          return isAuthenticated;
        }
      };
    }
  ]);
