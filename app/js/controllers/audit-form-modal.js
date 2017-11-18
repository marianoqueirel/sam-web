'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceAuditFormModalCtrl', [
                                      'ServiceAudit',
                                      '$rootScope',
                                      '$scope',
                                      '$uibModalInstance',
                                      'notification',
                                      'audit_id',
                                      'show',
                                      function (
                                        ServiceAudit,
                                        $rootScope,
                                        $scope,
                                        $uibModalInstance,
                                        notification,
                                        audit_id,
                                        show
                                      ) {

    var _getServiceAudit = function () {
      if (audit_id) {
        ServiceAudit.get(
          { id: audit_id },
          function (data) {
            $scope.audit = data;
          }
        );
      }
    };

    $scope.init = function () {
      $scope.audit = {};
      _getServiceAudit();
      $scope.service_type_options = [
                                      {id: 1, description: 'Nivel 1'},
                                      {id: 2, description: 'Nivel 2'},
                                      {id: 3, description: 'Nivel 3'}
                                    ];
      return true;
    };

    var create = function () {
      return true;
      //TODO
    };

    var save = function () {
      return true;
      //TODO
    };


    $scope.saveForm = function () {
      return true;
      //TODO
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
