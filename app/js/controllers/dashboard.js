'use strict';

angular.module('payeSAM.controllers')
  .controller('DashboardCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

      $scope.init = function () {
        $rootScope.loading = false;
      };

    }]);
