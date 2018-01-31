'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceAuditFormModalCtrl', [
    'ServiceAudit',
    'Provider',
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'notification',
    'audit',
    'show',
    'service_type_options',
    'company_id',
    function (
      ServiceAudit,
      Provider,
      $rootScope,
      $scope,
      $uibModalInstance,
      notification,
      audit,
      show,
      service_type_options,
      company_id
    )
  {

    var _getServiceAudit = function () {
      $scope.show = show;
      $scope.audit = audit;
      if ($scope.audit.started_on)
        $scope.audit.started_on = new Date($scope.audit.started_on);
      $scope.service_type_options = service_type_options;
      $scope.action = ($scope.audit.id ? 'edit' : 'create' );
    };

    $scope.init = function () {
      $scope.selected_provider = {};
      $scope.audit = {};
      _getServiceAudit();
      $scope.setSelectedProvider($scope.audit.provider);
      $scope.selected_provider = $scope.audit.provider;
    };

    $scope.setSelectedProvider = function (selectedProvider) {
      if (selectedProvider)
        $scope.audit.provider_id = selectedProvider.id;
    };

    $scope.refreshProviders = function(provider) {
      Provider
        .query(
          {
            searchProvider: provider,
            company_id: company_id,
            limit: 20
          }, function (response) {
            $scope.providers = response.rows;
          }, function () {
            notification.error('Error al buscar proveedores.');
          }
        );
    };

    $scope.$watch('audit.approved', function(newValue) {
      if(!newValue){
        $scope.service_type_option_id = null;
        $scope.provider_id = null;
        $scope.audit.days = null;
        $scope.audit.started_on = null;
        $scope.empty_values = true;
      }else{
        $scope.empty_values = false;
      }
    });

    var create = function () {
      ServiceAudit.new($scope.audit, function () {
        notification.success('Auditoria creada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.audit);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var save = function () {
      ServiceAudit.update(
        { id: $scope.audit.id, service_audit: $scope.audit },
        function () {
        notification.success('Auditoria guardada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.audit);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $scope.sending = true;
      if($scope.audit.started_on)
        $scope.audit.started_on = new Date($scope.audit.started_on);
      if(!$scope.audit.approved){
        $scope.audit.started_on = null;
        $scope.audit.days = null;
        $scope.audit.service_type_option_id = null;
        $scope.audit.provider_id = null;
      }
      if ($scope.action === 'create') {
        create();
      } else {
        save();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
