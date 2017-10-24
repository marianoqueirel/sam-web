'use strict';

angular.module('payeSAM.controllers')
  .controller('AuditorNewModalCtrl', ['$rootScope', '$scope', 'Auditor', '$uibModalInstance', 'notification', 'auditor_id', 'show', function ($rootScope, $scope, Auditor, $uibModalInstance, notification, auditor_id, show) {

    $scope.init = function () {
      $scope.sending = false;
      if (show) {
        $scope.action = 'show';
      }
      else {
        $scope.action = 'create';
      }
      $scope.show = show;
      $scope.auditor = {};
      if (auditor_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        Auditor.get(
          { id: auditor_id },
          function (data) {
            $scope.auditor = data;
          }
        );
      }
      switch ($scope.action) {
        case 'show':
          $scope.title = 'Ver';
          break;
        case 'edit':
          $scope.title = 'Editar';
          break;
        case 'create':
          $scope.title = 'Crear';
          break;
        }
    };

    var createAuditor = function () {
      Auditor.new($scope.auditor, function () {
        notification.success('Auditor creado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.auditor);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveAuditor = function () {
       Auditor.update(
        { id: $scope.auditor.id, auditor: $scope.auditor },
        function () {
        notification.success('Auditor guardado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.auditor);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
      if ($scope.action === 'create') {
        createAuditor();
      } else {
        saveAuditor();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
