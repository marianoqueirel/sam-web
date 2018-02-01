'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceAuditFilesModalCtrl', [
    'Attachment',
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'notification',
    'serviceAudit',
    function (
      Attachment,
      $rootScope,
      $scope,
      $uibModalInstance,
      notification,
      serviceAudit
    )
  {

    var _getFiles = function(serviceAuditId) {
      if (serviceAuditId) {
        Attachment
          .query({
            service_audit_id: serviceAuditId
          }, function (data) {
            $scope.service = data.service;
            $scope.files = data.files;
            $scope.files1 = _.filter($scope.files, function(value) {
              return value.file_type === 1;
            });
            $scope.files2 = _.filter($scope.files, function(value) {
              return value.file_type === 2;
            });
            $scope.files3 = _.filter($scope.files, function(value) {
              return value.file_type === 3;
            });
            $scope.files4 = _.filter($scope.files, function(value) {
              return value.file_type === 4;
            });
          }, function (error) {
            $scope.files = {};
            $scope.files1 = {};
            $scope.files2 = {};
            $scope.files3 = {};
            $scope.files4 = {};
            notification.error('No se pueden cargar los archivos de esta auditoria.');
          });
      }
    };

    $scope.init = function () {
      $rootScope.loading = true;
      _getFiles(serviceAudit.id);
      $scope.selectedAudit = serviceAudit;
      $rootScope.loading = false;
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
