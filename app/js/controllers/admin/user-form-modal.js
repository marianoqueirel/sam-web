'use strict';

angular.module('payeSAM.controllers')
  .controller('UserFormModalCtrl', ['$rootScope', '$scope', 'User', '$uibModalInstance', 'notification', 'user_id', 'show', function ($rootScope, $scope, User, $uibModalInstance, notification, user_id, show) {

    $scope.init = function () {
      $scope.sending = false;
      if (show) {
        $scope.action = 'show';
      }
      else {
        $scope.action = 'create';
      }
      $scope.show = show;
      $scope.user = {};
      if (user_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        User.get(
          { id: user_id },
          function (data) {
            $scope.user = data;
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

    var createUser = function () {
      User.new($scope.user, function () {
        notification.success('User creado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.user);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        $scope.form_errors = err.data.errors;
        notification.error('Error.');
      });
    };

    var saveUser = function () {
       User.update(
        { id: $scope.user.id, user: $scope.user },
        function () {
        notification.success('User guardado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.user);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        $scope.form_errors = err.data.errors;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
      if ($scope.action === 'create') {
        createUser();
      } else {
        saveUser();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
