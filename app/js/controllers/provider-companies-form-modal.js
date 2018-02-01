'use strict';

angular.module('payeSAM.controllers')
  .controller('ProviderCompaniesFormModalCtrl', [
    '$rootScope',
    '$scope',
    'Provider',
    'Company',
    '$uibModalInstance',
    'notification',
    'provider_id',
    function (
      $rootScope,
      $scope,
      Provider,
      Company,
      $uibModalInstance,
      notification,
      provider_id
    ) {

    $scope.init = function () {
      $scope.providerCompanies = {companies: []};
      Provider.get(
        {id: provider_id},
        function (response) {
          $scope.provider = response;
          Company
            .query({}, function (response) {
              $scope.companies = response.rows;
              $scope.companies.forEach(function (company) {
                if($scope.provider.companies_ids.indexOf(company.id) >= 0){
                  $scope.providerCompanies.companies.push(company);
                }
              });
            }, function () {
              notification.error('Error al cargar usuarios.');
            });

        }, function () {
          notification.error('Error al cargar el prestador.');
        }
      );

    };

    $scope.saveForm = function () {
      var companies_ids = $scope.providerCompanies.companies.map(function (user) {
        return user.id;
      });

      Provider.add_companies(
        { id: provider_id, companies_ids: companies_ids },
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
