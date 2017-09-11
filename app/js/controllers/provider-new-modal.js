'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderNewModalCtrl', ['$rootScope', '$scope', 'Provider', '$modalInstance', 'notifications', function ($rootScope, $scope, Provider, $modalInstance, notifications) {

    $scope.init = function () {
      $scope.sending = false;
    };


    $scope.createProvider = function () {
      $rootScope.loading = true;
      $scope.sending = true;

      Provider.new($scope.order, function () {
        notifications.success('Provider created successfully.');

        $rootScope.loading = false;
        $scope.sending = false;

        $modalInstance.close();
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notifications.error('Error.');
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);
