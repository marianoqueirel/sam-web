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
    'Attachment',
    function (
      $filter,
      $rootScope,
      $scope,
      $routeParams,
      $uibModal,
      Service,
      ServiceType,
      Patient,
      notification,
      Attachment
    )
  {

    var _getService = function () {
      var service_id = $routeParams.id;
      if (service_id) {
        Service.get(
          { id: service_id },
          function (data) {
            $scope.service = data;
            $scope.selectedAudit = {};
            $scope.selectedAuditId = null;
            $scope.files = {};
            $scope.files1 = {};
            $scope.files2 = {};
            $scope.files3 = {};
            $scope.files4 = {};
          }
        );
      }
    };

    var _getFiles = function(serviceAuditId) {
      if (serviceAuditId) {
        $rootScope.loading = true;
        Attachment
          .query({
            service_audit_id: serviceAuditId
          }, function (data) {
            $scope.files = data;
            $scope.files1 = _.filter($scope.files, function(value) {
              return value.file_type === 1;
            });
            $scope.files2 = _.filter($scope.files, function(value) {
              return value.file_type === 2;
            });
            $scope.files3 = _.filter($scope.files, function(value) {
              return value.file_type === 3;
            });
            $scope.files4 = _.filter($scope.files, function(value) {
              return value.file_type === 4;
            });
          }, function (error) {
            $scope.files = {};
            $scope.files1 = {};
            $scope.files2 = {};
            $scope.files3 = {};
            $scope.files4 = {};
            notification.error('No se pueden cargar los archivos de esta auditoria.');
          });
        $rootScope.loading = false;
      }
    };

    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;

      $scope.files = {};
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

        modalInstance.closed.then(function(){
          _getFiles($scope.selectedAuditId);
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
      if (status === 'approved_in_progress') { return 'Aprobado en Curso'; }
      if (status === 'approved_finished') { return 'Aprobado Finalizado'; }
      if (status === 'rejected') { return 'Rechazado'; }
    };

    $scope.statusColor = function (status) {
      if (status === 'pending') { return 'warning'; }
      if (status === 'approved_in_progress') { return 'success'; }
      if (status === 'approved_finished') { return 'success'; }
      if (status === 'rejected') { return 'danger'; }
    };

    $scope.loadFiles = function (serviceAudit) {
      if (serviceAudit) {
        _getFiles(serviceAudit.id);
        $scope.selectedAudit = serviceAudit;
        $scope.selectedAuditId = serviceAudit.id;
      }
    };

    $scope.deleteFile = function (id, fileName, auditId) {
      if (id) {
        $rootScope.loading = true;
        var confirmation = window.confirm('Esta seguro que desea eliminar el archivo ' + fileName + '?');

        if (confirmation) {
          Attachment
            .delete({
              id: id
            }, function (data) {
              _getFiles(auditId);
            }, function (error) {
              notification.error('No se pudo eliminar el archivo ' + fileName + '.');
            });
        }
        $rootScope.loading = false;
      }
    };
  }
]);
