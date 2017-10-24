'use strict';

angular.module('payeSAM.controllers')
  .controller('AdminDashboardCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

      $scope.init = function () {
        $rootScope.loading = false;
      };

    }]);
