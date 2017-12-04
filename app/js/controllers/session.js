'use strict';

angular.module('payeSAM.controllers')
  .controller('SessionCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'LoginService',
    'rootURL',
    'localStorageService',
    function($rootScope,
      $scope,
      $location,
      LoginService,
      rootURL,
      localStorageService)
    {

      $scope.init = function() {
        var user = localStorageService.get('currentUser');

        if (user){
          $location.path(rootURL);
        }
      };

      $scope.logout = function() {
        localStorageService.remove('currentUser');
        delete $rootScope.currentUser;
        $rootScope.loading = false;
        $location.path('/login');
      };

      $scope.formSubmit = function() {
        LoginService.login($scope.username, $scope.password);
      };
    }
  ]);
