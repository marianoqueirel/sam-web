'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceAuditCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ServiceAudit',
    'Provider',
    'notification',
    'paginationLimit',
    '$uibModal',
    function (
      $rootScope,
      $scope,
      $http,
      $location,
      ServiceAudit,
      Provider,
      notification,
      paginationLimit,
      $uibModal)
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

      var _getAudits = function (page) {
        $rootScope.loading = true;
        $scope.selectedAuditId = null;
        ServiceAudit
          .query({
            searchAudits: $scope.term,
            date_from: $scope.date_from,
            date_to: $scope.date_to,
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            provider_id: $scope.provider_id
          }, function (response) {
            $scope.audits = response.rows;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar periodos.');
            $rootScope.loading = false;
          });
      };

      var loadProviders = function () {
        Provider.for_select(
          {},
          function (response) {
            $scope.providers = response;
          }
        );
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        _getAudits($scope.currentPage);
        loadProviders();
      };

      $scope.searchAudits = function () {
        _getAudits();
      };

      $scope.markAsPayed = function (audit) {
        var confirmation = window.confirm('Esta seguro que desea marcar como pagada?');
        if (confirmation){
          ServiceAudit.markAsPayed(
            {id: audit.id},
            function (response) {
              audit = response;
              _getAudits();
            }
          );
        }
      };

      $scope.$watch('pagination.currentPage', function() {
        _getAudits();
      });

      $scope.filesModal = function (serviceAudit) {
        $scope.selectedAuditId = serviceAudit.id;
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/audit-files.html',
          controller: 'ServiceAuditFilesModalCtrl',
          size: 'lg',
          resolve: {
            serviceAudit: function () {
              return serviceAudit;
            }
          }
        });

        modalInstance.result.then(function(){
          _getAudits();
        });

        modalInstance.closed.then(function(){
          $scope.selectedAuditId = null;
        });
      };
  }]);


