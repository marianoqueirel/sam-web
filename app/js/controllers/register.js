'use strict';

angular.module('payeSAM.controllers')
  .controller('RegisterCtrl', ['$rootScope', '$scope', '$location', 'RegisterUser', 'notification',
    function($rootScope, $scope, $location, RegisterUser, notification) {

      $scope.registerUser = function () {
        $scope.form_errors = {};
        $rootScope.loading = true;
        RegisterUser.new(
          $scope.user,
          function (data) {
            notification.success('Usuario Creado.');
            $rootScope.loading = false;
            $location.path('/login');
          },
          function (data) {
            $scope.form_errors = data.data.errors;
            notification.error('Error al crear Usuario');
            $rootScope.loading = false;
          }
        );
      };

      $scope.validatorLabel = function (key) {
        var msg = {
          'not_present': 'Es requerido',
          'not_email': 'El email es incorrecto',
          'not_in_range': 'Minimo 6 caracteres',
          'not_equal': 'No coinciden'
        };

        return msg[key];
      };
    }
  ]);
