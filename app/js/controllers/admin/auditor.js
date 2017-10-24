'use strict';

angular.module('payeSAM.controllers')
  .controller('AdminAuditorsCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Auditor', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Auditor, notification, paginationLimit) {
      var _getAuditors = function (page) {
        $rootScope.loading = true;
        Auditor
          .query({
            page: $scope.currentPage,
            searchAuditor: $scope.term
          }, function (response) {
            $scope.auditors = response.rows;
            $scope.totalItems = response.count;
            $scope.totalPages = Math.ceil(response.count / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar auditores.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getAuditors($scope.currentPage);
      };

      $scope.auditorModal = function (auditor, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/admin/modals/auditor-form.html',
          controller: 'AuditorNewModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            auditor_id: function() {
              return (auditor && auditor.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getAuditors();
        });
      };

      $scope.searchAuditor = function () {
        _getAuditors();
      };

      $scope.deleteAuditor = function (auditor) {
        var confirmation = window.confirm('Esta seguro que desea eliminar este Auditor?');

        if (confirmation) {
          $rootScope.loading = true;

          Auditor
          .delete({ id: auditor.id }, function () {
            notification.success('Auditor eliminado con exito.');
            _getAuditors();
          }, function () {
            $rootScope.loading = false;
            notification.error('Ocurrio un error al intentar eliminar el auditor.');
          });
        }
      };
  }]);


