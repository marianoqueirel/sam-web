'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Provider', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Provider, notification, paginationLimit) {
      var _getProviders = function (page) {
        $rootScope.loading = true;

        Provider
          .query({
            page: $scope.currentPage,
          }, function (response) {
            $scope.providers = response.rows;
            $scope.totalItems = response.count;
            $scope.totalPages = Math.ceil(response.count / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar prestadores.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        _getProviders($scope.currentPage);
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


