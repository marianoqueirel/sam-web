'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderNewModalCtrl', ['$rootScope', '$scope', 'Provider', '$uibModalInstance', 'notification', 'provider_id', function ($rootScope, $scope, Provider, $uibModalInstance, notification, provider_id) {

    $scope.init = function () {
      $scope.sending = false;
      $scope.action = 'create';
      $scope.provider = {};
      if (provider_id) {
        $scope.action = 'edit';
        Provider.get(
          { id: provider_id },
          function (data) {
            $scope.provider = data;
          }
        );
      }
    };

    var createProvider = function () {
      Provider.new($scope.provider, function () {
        notification.success('Provider created successfully.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.provider);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveProvider = function () {
       Provider.update(
        { id: $scope.provider.id, provider: $scope.provider },
        function () {
        notification.success('Provider saved successfully.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.provider);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
      if ($scope.action === 'create') {
        createProvider();
      } else {
        saveProvider();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
