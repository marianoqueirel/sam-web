'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceShowCtrl', [
    '$filter',
    '$rootScope',
    '$scope',
    '$routeParams',
    '$uibModal',
    'Service',
    'ServiceType',
    'Patient',
    'notification',
    function (
      $filter,
      $rootScope,
      $scope,
      $routeParams,
      $uibModal,
      Service,
      ServiceType,
      Patient,
      notification
    )
  {

    var _getService = function () {
      var service_id = $routeParams.id;
      if (service_id) {
        Service.get(
          { id: service_id },
          function (data) {
            $scope.service = data;
          }
        );
      }
    };

    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;

      $scope.service = {};
      _getService();
    };

    $scope.auditModal = function (audit, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/audit-form.html',
          controller: 'ServiceAuditFormModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            service_type_options: function () {
              return $scope.service.available_service_type_options;
            },
            audit: function() {
              return (audit);
            }
          }
        });

        modalInstance.result.then(function(){
          _getService();
        });
      };

    $scope.requireAudit = function (serviceId, name) {
      if (serviceId) {
        var confirmation = window.confirm('Desea solicitar una nueva auditoria para ' + name + '?');

        if (confirmation) {
          $rootScope.loading = true;

          Service
          .requireAudit({ id: serviceId }, function () {
            notification.success('Auditoria requerida con exito!.');
            _getService();
          }, function () {
            notification.error('No puede requerir una nueva auditoria para este paciente teniendo otra pendiente.');
          });
          $rootScope.loading = false;
        }
      }
    };

    $scope.statusText = function (status) {
      if (status === 'pending') { return 'Pendiente'; }
      if (status === 'approved') { return 'Aprobado'; }
      if (status === 'rejected') { return 'Rechazado'; }
    };

    $scope.statusColor = function (status) {
      if (status === 'pending') { return 'warning'; }
      if (status === 'approved') { return 'success'; }
      if (status === 'rejected') { return 'danger'; }
    };
  }
]);
