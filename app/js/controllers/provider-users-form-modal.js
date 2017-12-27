'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderUserFormModalCtrl', [
    '$rootScope',
    '$scope',
    'Provider',
    'User',
    '$uibModalInstance',
    'notification',
    'provider_id',
    function (
      $rootScope,
      $scope,
      Provider,
      User,
      $uibModalInstance,
      notification,
      provider_id
    ) {

    $scope.init = function () {
      Provider.get(
        {id: provider_id},
        function (response) {
          $scope.provider = response;
        }, function () {
          notification.error('Error al cargar el prestador.');
        }
      );

      $scope.providerUsers = {users: []};

      User
        .query({
          limit: 10000,
          userType: 'User'
        }, function (response) {
          $scope.users = response.rows;
          $scope.users.forEach(function (user) {
            if($scope.provider.users_ids.indexOf(user.id) >= 0){
              $scope.providerUsers.users.push(user);
            }
          });
        }, function () {
          notification.error('Error al cargar usuarios.');
        });
    };

    $scope.saveForm = function () {
      var users_ids = $scope.providerUsers.users.map(function (user) {
        return user.id;
      });

      Provider.add_users(
        { id: provider_id, users_ids: users_ids },
        function (response) {
          $uibModalInstance.close($scope.provider);
        }, function () {
          notification.error('Error.');
        }
      );
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };

    $scope.validatorLabel = function (key) {
      var msg = {
        'not_present': 'Es requerido',
        'not_numeric': 'No es número',
        'format': 'Formato Inválido'
      };
      return msg[key];
    };
  }
]);
