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
    'Location',
    function (
      $rootScope,
      $scope,
      $http,
      $location,
      $uibModal,
      Service,
      ServiceType,
      notification,
      paginationLimit,
      Location)
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

      $scope.statuses = [
        { key: 'pending', label: 'Pendiente'},
        { key: 'approved_in_progress', label: 'Aprobado en Curso'},
        { key: 'approved_finished', label: 'Aprobado Finalizado'},
        { key: 'rejected', label: 'Rechazado'}
      ];

      var _getServices = function (page) {
        $rootScope.loading = true;
        $scope.pagination.currentPage = page || 1;
        $location.search('page', $scope.pagination.currentPage);
        $location.search('term', $scope.term);
        $location.search('search_company_id', $scope.search_company_id);
        $location.search('service_type_id', $scope.service_type_id);
        $location.search('selectedStatus', $scope.selectedStatus);
        $location.search('selected_city_id', $scope.selected_city_id);
        Service
          .query({
            searchService: $scope.term,
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            company_id: $scope.search_company_id,
            service_type_id: $scope.service_type_id,
            status: $scope.selectedStatus,
            city_id: $scope.selected_city_id
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

      $scope.setCity = function (city) {
        if (city) {
          $scope.selected_city_id = city.id;
        }
        _getServices();
      };

      $scope.listCities = function (query) {
        $scope.availableCities = [];
        if (query && query.length >= 3) {
          $scope.loadingCities = true;
          Location.cities(
            {
              state_id: $scope.selectedState.id,
              name: query
            },
            function (data) {
              $scope.availableCities = data;
            }, function () {
                notification.error('Error al cargar los ciudades.');
                $scope.loadingCities = false;
            });
        }
      };

      var setSelectedState = function (state) {
        $scope.availableCities = [];
        $scope.selectedState = state;
        $scope.city_id = null;
        $scope.availableCities = [];
      };

      var listStates = function (query) {
        $scope.availableStates = [];
        if (query && query.length >= 3) {
          $scope.loadingStates = true;
          Location.states(
            {name: query},
            function (data) {
              $scope.availableStates = data;
              setSelectedState($scope.availableStates[0]);
            }, function () {
                notification.error('Error al cargar los provincias.');
                $scope.loadingStates = false;
            });
          if ($scope.selected_city_id){
            Location.city({ city_id: $scope.selected_city_id }, function (response) {
              $scope.availableCities = [response];
              $scope.city_id = response;
              $scope.selected_city_id = $scope.city_id.id;
              }, function () {
                notification.error('Error al cargar ciudad');
              }
            );
          }
        }
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.term = $location.search().term || null;
        $scope.search_company_id = $location.search().search_company_id || null;
        $scope.service_type_id = $location.search().service_type_id || null;
        $scope.selectedStatus = $location.search().selectedStatus || null;
        $scope.selected_city_id = $location.search().selected_city_id || null;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getServices($scope.pagination.currentPage);
        loadServiceTypes();
        listStates('CORRIENTES');
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
        $scope.pagination.currentPage = 1;
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

      $scope.$watch('pagination.currentPage', function(page) {
        _getServices(page);
      });

      $scope.clear = function($event, $select) {
        $event.stopPropagation();
        $scope.selected_city_id = undefined;
        $select.selected = undefined;
      };
  }]);


