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
                                  ) {
    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;

      $scope.service = {};
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

    $scope.newAudit = function () {
      var modalInstance = $uibModal.open({
          templateUrl: 'views/services/audit-form.html',
          controller: 'AuditFormModalCtrl',
          size: 'lg'
        });

        modalInstance.result.then(function(){
          //TODO
          return true;
        });
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
