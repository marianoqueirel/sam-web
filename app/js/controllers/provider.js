'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderCtrl', ['$rootScope', '$scope', '$http', '$location', '$modal', 'Provider', 'notifications', 'paginationLimit', function ($rootScope, $scope, $http, $location, $modal, Provider, notifications, paginationLimit) {
      $scope.init = function () {
      };

      $scope.addProvider = function () {
        $rootScope.loading = true;
        $scope.sending = true;

        Provider
          .create({ name: $scope.name }, function () {
            notifications.success('Prestador creado satisfactoriamente.');

            $rootScope.loading = false;
            $scope.sending = false;

            $modal.close();
          }, function () {
            $rootScope.loading = false;
            $scope.sending = false;

            notifications.error('Error al crear prestador.');
        });
      };

      $scope.newProviderModal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'views/modals/provider-new.html',
          controller: 'ProviderNewModalCtrl',
          size: 'lg',
        });

        // modalInstance.result.then(_getProviders);
        modalInstance.result();
      };
  }]);


