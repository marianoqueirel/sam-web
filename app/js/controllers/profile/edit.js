'use strict';

angular.module('payeSAM.controllers')
  .controller('ProfileEditCtrl', ['$rootScope', '$scope', '$location', '$window', 'EditUser',
    function ($rootScope, $scope, $location, $window, EditUser) {

      $scope.title = '';
      $scope.edit_profile = $rootScope.currentUser;

      $scope.init = function () {
      };

      $scope.editProfile = function () {
        $scope.form_errors = {};
        $rootScope.loading = true;
        EditUser.new(
          $scope.edit_profile,
          function (data) {
            $rootScope.loading = false;
            $location.path('/dashboard');
          },
          function (data) {
            $scope.form_errors = data.data.errors;
            $rootScope.loading = false;
          }
        );
      };

      $scope.cancelEdit = function () {
        $window.location.reload();
        $location.path('/dashboard');
      };

      $scope.validatorLabel = function (key) {
        var msg = {
          'not_present': 'Es requerido',
          'not_in_range': 'Minimo 6 caracteres',
          'not_equal': 'No coinciden'
        };
        return msg[key];
      };

    }]);
