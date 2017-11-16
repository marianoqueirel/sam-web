'use strict';

angular.module('payeSAM.controllers')
  .controller('AuditFormModalCtrl', [
                                      '$rootScope',
                                      '$scope',
                                      '$uibModalInstance',
                                      'notification',
                                      function (
                                        $rootScope,
                                        $scope,
                                        $uibModalInstance,
                                        notification
                                      ) {

    $scope.init = function () {
      //TODO
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
