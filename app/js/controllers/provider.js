'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Provider', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Provider, notification, paginationLimit) {
      $scope.init = function () {
      };

      $scope.addProvider = function () {
        $rootScope.loading = true;
        $scope.sending = true;

        Provider
          .create({ name: $scope.name }, function () {
            notification.success('Prestador creado satisfactoriamente.');

            $rootScope.loading = false;
            $scope.sending = false;

            $uibModal.close();
          }, function () {
            $rootScope.loading = false;
            $scope.sending = false;

            notification.error('Error al crear prestador.');
        });
      };

      $scope.newProviderModal = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/provider-new.html',
          controller: 'ProviderNewModalCtrl',
          size: 'lg',
        });

        modalInstance.result.then(null);
      };
  }]);


