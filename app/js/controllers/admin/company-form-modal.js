'use strict';

angular.module('payeSAM.controllers')
  .controller('CompanyFormModalCtrl', [
    '$rootScope',
    '$scope',
    'Company',
    '$uibModalInstance',
    'notification',
    'company_id',
    'show',
    function ($rootScope,
      $scope,
      Company,
      $uibModalInstance,
      notification,
      company_id,
      show)
    {

    $scope.init = function () {
      $scope.form_errors = null;
      $scope.sending = false;
      if (show) {
        $scope.action = 'show';
      }
      else {
        $scope.action = 'create';
      }
      $scope.company = {};
      $scope.show = show;
      if (company_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        Company.get(
          { id: company_id },
          function (data) {
            $scope.company = data;
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

    var createCompany = function () {
      Company.new($scope.company, function () {
        notification.success('Empresa creada.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.company);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveCompany = function () {
       Company.update(
        { id: $scope.company.id, company: $scope.company },
        function () {
        notification.success('Proveedor Guardado.');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.company);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
      if ($scope.action === 'create') {
        createCompany();
      } else {
        saveCompany();
      }
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
