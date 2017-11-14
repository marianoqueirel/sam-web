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
      var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
          new window.Switchery(html, {
            color: '#26B99A'
          });
      });
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
