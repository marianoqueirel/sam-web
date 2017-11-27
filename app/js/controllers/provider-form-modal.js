'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderFormModalCtrl', ['$rootScope', '$scope', 'Provider', '$uibModalInstance', 'notification', 'provider_id', 'show', function ($rootScope, $scope, Provider, $uibModalInstance, notification, provider_id, show) {

    $scope.init = function () {
      $scope.form_errors = null;
      $scope.sending = false;
      if (show) {
        $scope.action = 'show';
      }
      else {
        $scope.action = 'create';
      }
      $scope.provider = {};
      if (provider_id) {
        if (!show) {
          $scope.action = 'edit';
        }
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
        notification.success('Proveedor Creado.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.provider);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveProvider = function () {
       Provider.update(
        { id: $scope.provider.id, provider: $scope.provider },
        function () {
        notification.success('Proveedor Guardado.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.provider);
      }, function (err) {
        $scope.form_errors = err.data.errors;
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

    $scope.validatorLabel = function (key) {
      var msg = {
        'not_present': 'Es requerido',
        'not_numeric': 'No es número',
        'format': 'Formato Inválido'
      };
      return msg[key];
    };
  }
]);
