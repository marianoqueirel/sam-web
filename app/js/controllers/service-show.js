'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceShowCtrl', ['$filter', '$rootScope', '$scope', '$routeParams', 'Service', 'ServiceType', 'Patient', '$uibModalInstance', 'notification', function ($filter, $rootScope, $scope, '$routeParams', Service, ServiceType, Patient, $uibModalInstance, notification) {
    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;

      $scope.service = {};
      if (service_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        Service.get(
          { id: service_id },
          function (data) {
            $scope.availablePatients = [data.patient];
            $scope.setSelectedPatient(data.patient);
            $rootScope.selectedPatients = [data.patient];
            $scope.service = data;
            $scope.service.started_at = new Date($scope.service.started_at);
          }
        );
      }
    };
  }
]);
