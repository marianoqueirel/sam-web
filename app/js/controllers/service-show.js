'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceShowCtrl', [
                                  '$filter',
                                  '$rootScope',
                                  '$scope',
                                  '$routeParams',
                                  'Service',
                                  'ServiceType',
                                  'Patient',
                                  'notification',
                                  function (
                                    $filter,
                                    $rootScope,
                                    $scope,
                                    $routeParams,
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
            $scope.service.place = 'Un Lugar en el mundo';
            $scope.service.diagnosis = 'Un Lugar diagnostico';
            $scope.service.audits = [
              {
                'approved': true,
                'started_on': moment().format('DD-MM-YYY'),
                'days': 15,
                'provider_name': 'Proveedor 1',
                'service_type_option': 'Nivel I',
                'auditor_name': 'Auditor 1'
              },
              {
                'approved': false,
                'started_on': moment().format('DD-MM-YYY'),
                'days': 15,
                'provider_name': 'Proveedor 2',
                'service_type_option': 'Nivel II',
                'auditor_name': 'Auditor 2'

              }
            ];
          }
        );
      }
    };
  }
]);
