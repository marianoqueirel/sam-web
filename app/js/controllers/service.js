'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Service', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Service, notification, paginationLimit) {
      var _getServices = function (page) {
        $rootScope.loading = true;
        Service
          .query({
            page: $scope.currentPage
          }, function (response) {
            $scope.services = response.rows;
            $scope.totalItems = response.count;
            $scope.totalPages = Math.ceil(response.count / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar internaciones.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getServices($scope.currentPage);
      };

      $scope.serviceModal = function (service, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/service-form.html',
          controller: 'ServiceFormModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            service_id: function() {
              return (service && service.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getServices();
        });
      };

      $scope.searchService = function () {
        _getServices();
      };

      $scope.deleteService = function (service) {
        var confirmation = window.confirm('Esta seguro que desea eliminar esta Internacion?');

        if (confirmation) {
          $rootScope.loading = true;

          Service
          .delete({ id: service.id }, function () {
            notification.success('Internacion eliminada con exito.');
            _getServices();
          }, function () {
            $rootScope.loading = false;
            notification.error('Ocurrio un error al intentar eliminar la internacion.');
          });
        }
      };
  }]);


