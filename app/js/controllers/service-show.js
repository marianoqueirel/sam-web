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
          }
        );
      }
    };
  }
]);
