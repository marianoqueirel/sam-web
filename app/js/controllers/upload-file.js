'use strict';

angular.module('payeSAM.controllers').controller('UploadFile', ['$scope', 'Upload', '$timeout', 'apiUrl', function ($scope, Upload, $timeout, apiUrl) {
  $scope.uploadFiles = function(service_audit_id, files, errFiles) {
    $scope.files = files;
    $scope.errFiles = errFiles;
    angular.forEach(files, function(file) {
      file.upload = Upload.upload({
        url: apiUrl + '/service_audits/upload',
        data: {service_audit_id: service_audit_id, file: file}
      });

      file.upload.then(function (response) {
        $timeout(function () {
            file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0)
         $scope.errorMsg = response.data.message;
      }, function (evt) {
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    });
  };
}]);
