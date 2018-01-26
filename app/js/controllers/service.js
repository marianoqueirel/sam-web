'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$uibModal',
    'Service',
    'ServiceType',
    'notification',
    'paginationLimit',
    function (
      $rootScope,
      $scope,
      $http,
      $location,
      $uibModal,
      Service,
      ServiceType,
      notification,
      paginationLimit)
    {
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

      var _getServices = function (page) {
        $rootScope.loading = true;
        Service
          .query({
            searchService: $scope.term,
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            company_id: $scope.search_company_id,
            service_type_id: $scope.service_type_id
          }, function (response) {
            $scope.services = response.rows;
            $scope.companies = response.companies;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar internaciones.');
            $rootScope.loading = false;
          });
      };

      var loadServiceTypes = function () {
        ServiceType.query(
          {},
          function (response) {
            $scope.service_types = response;
          }
        );
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getServices($scope.currentPage);
        loadServiceTypes();
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

      $scope.requireAudit = function (serviceId, name) {
        if (serviceId) {
          var confirmation = window.confirm('Desea solicitar una nueva auditoria para ' + name + '?');

          if (confirmation) {
            $rootScope.loading = true;

            Service
            .requireAudit({ id: serviceId }, function () {
              notification.success('Auditoria requerida con exito!.');
              _getServices();
            }, function () {
              notification.error('No puede requerir una nueva auditoria para este paciente teniendo otra pendiente.');
            });
            $rootScope.loading = false;
          }
        }
      };

      $scope.$watch('pagination.currentPage', function() {
        _getServices();
      });
  }]);


