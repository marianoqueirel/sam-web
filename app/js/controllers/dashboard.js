'use strict';

angular.module('payeSAM.controllers')
  .controller('DashboardCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope, PersonalCheck, ThirdCheck) {

      $scope.init = function () {
        $rootScope.loading = false;
      };

    }]);
