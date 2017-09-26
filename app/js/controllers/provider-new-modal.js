'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderNewModalCtrl', ['$rootScope', '$scope', 'Provider', '$uibModalInstance', 'notification', function ($rootScope, $scope, Provider, $uibModalInstance, notification) {

    $scope.init = function () {
      $scope.sending = false;
      $scope.provider = {};
    };


    $scope.createProvider = function () {
      $rootScope.loading = true;
      $scope.sending = true;

      Provider.new($scope.provider, function () {
        notification.success('Provider created successfully.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close();
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
