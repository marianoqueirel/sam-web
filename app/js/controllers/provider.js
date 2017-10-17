'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Provider', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Provider, notification, paginationLimit) {
      $scope.sort = {
        column: 'created_at',
        descending: false
      };

      $scope.pagination = {
        currentPage: 1,
        maxSize: 12,
        totalItems: 0,
        itemsPerPage: 10
      };

      $scope.filters = {};

      var _getProviders = function () {
        $rootScope.loading = true;

        Provider
          .query({
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            searchProvider: $scope.term
          }, function (response) {
            $scope.providers = response.rows;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar prestadores.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        _getProviders();
      };

      $scope.providerModal = function (provider) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/provider-new.html',
          controller: 'ProviderNewModalCtrl',
          size: 'lg',
          resolve: {
            provider_id: function() {
              return (provider && provider.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getProviders();
        });
      };

      $scope.searchProvider = function () {
        _getProviders();
      };

      $scope.deleteProvider = function (provider) {
        var confirmation = window.confirm('¿Esta seguro que desea borrar este Proveedor?');

        if (confirmation) {
          $rootScope.loading = true;

          Provider
          .delete({ id: provider.id }, function () {
            notification.success('Proveedor Borrado.');
            _getProviders();
          }, function () {
            $rootScope.loading = false;
            notification.error('Error al intentar borrar el Proveedor.');
          });
        }
      };

      $scope.$watch('pagination.currentPage', function() {
        _getProviders();
      });
  }]);


