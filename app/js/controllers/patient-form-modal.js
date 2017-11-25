'use strict';

angular.module('payeSAM.controllers')
  .controller('PatientFormModalCtrl',
                [
                  '$rootScope',
                  '$scope',
                  'Patient',
                  '$uibModalInstance',
                  'notification',
                  'patient_id',
                  'show',
                  function (
                    $rootScope,
                    $scope,
                    Patient,
                    $uibModalInstance,
                    notification,
                    patient_id,
                    show
                  ) {

    $scope.init = function () {
      $scope.sending = false;
      if (show) {
        $scope.action = 'show';
      }
      else {
        $scope.action = 'create';
      }
      $scope.show = show;
      $scope.patient = {};
      if (patient_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        Patient.get(
          { id: patient_id },
          function (data) {
            $scope.patient = data;
            $scope.patient.birthday = new Date($scope.patient.birthday);
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

    var createPatient = function () {
      Patient.new($scope.patient, function () {
        notification.success('Paciente creado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.patient);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var savePatient = function () {
       Patient.update(
        { id: $scope.patient.id, patient: $scope.patient },
        function () {
        notification.success('Paciente guardado con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.patient);
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
        createPatient();
      } else {
        savePatient();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
