'use strict';

angular.module('payeSAM.controllers')
  .controller('CompanyCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$uibModal',
    'Company',
    'notification',
    'paginationLimit',
    function (
      $rootScope,
      $scope,
      $http,
      $location,
      $uibModal,
      Company,
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

      var _getCompanies = function (page) {
        $rootScope.loading = true;
        Company
          .query({
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            company_id: $scope.search_company_id,
            searchCompany: $scope.term
          }, function (response) {
            $scope.companies = response.rows;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar empresas.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getCompanies($scope.currentPage);
      };

      $scope.companyModal = function (company, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/company-form.html',
          controller: 'CompanyFormModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            company_id: function() {
              return (company && company.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getCompanies();
        });
      };

      $scope.searchCompanies = function () {
        _getCompanies();
      };

      $scope.deleteCompany = function (company) {
        var confirmation = window.confirm('Esta seguro que desea eliminar esta Empresa?');

        if (confirmation) {
          $rootScope.loading = true;

          Company
          .delete({ id: company.id }, function () {
            notification.success('Empresa eliminada con exito.');
            _getCompanies();
          }, function () {
            $rootScope.loading = false;
            notification.error('Ocurrio un error al intentar eliminar el Empresa.');
          });
        }
      };

      $scope.$watch('pagination.currentPage', function() {
        _getCompanies();
      });
  }]);


