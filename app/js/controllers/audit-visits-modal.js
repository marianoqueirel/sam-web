'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceAuditVisitsModalCtrl', [
    'Visit',
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'notification',
    'serviceAudit',
    function (
      Visit,
      $rootScope,
      $scope,
      $uibModalInstance,
      notification,
      serviceAudit
    )
  {

    var _getVisits = function(serviceAuditId) {
      if (serviceAuditId) {
        Visit
          .query({
            service_audit_id: serviceAuditId
          }, function (data) {
            $scope.visits = data.rows;
          }, function (error) {
            notification.error('No se pueden cargar las visitas de esta auditoria.');
          });
      }
    };

    $scope.init = function () {
      $scope.visit = { service_audit_id: serviceAudit.id };
      $rootScope.loading = true;
      _getVisits(serviceAudit.id);
      $scope.selectedAudit = serviceAudit;
      $rootScope.loading = false;
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };

    $scope.saveForm = function () {
      $rootScope.loading = true;
      Visit.new($scope.visit, function () {
        notification.success('Visita creada con exito!');
        _getVisits(serviceAudit.id);
        $rootScope.loading = false;
        $scope.sending = false;
        $scope.visit = {
          service_audit_id: serviceAudit.id,
          comment: null,
          visited_at: null
        };

      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };
  }
]);
