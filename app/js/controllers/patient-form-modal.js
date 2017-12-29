'use strict';

angular.module('payeSAM.controllers')
  .controller('PatientFormModalCtrl',
                [
                  '$rootScope',
                  '$scope',
                  'Patient',
                  'Location',
                  '$uibModalInstance',
                  'notification',
                  'patient_id',
                  'show',
                  function (
                    $rootScope,
                    $scope,
                    Patient,
                    Location,
                    $uibModalInstance,
                    notification,
                    patient_id,
                    show
                  ) {

    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingStates = false;
      $scope.selectedState = null;
      $scope.selectedCity = null;
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

    $scope.listStates = function (query) {
      $scope.availableStates = [];
      if (query && query.length >= 3) {
        $scope.loadingStates = true;
        Location.states(
          {name: query},
          function (data) {
            $scope.availableStates = data;
          }, function () {
              notification.error('Error al cargar los provincias.');
              $scope.loadingStates = false;
          });
      }
    };

    $scope.listCities = function (query) {
      $scope.availableCities = [];
      if (query && query.length >= 3) {
        $scope.loadingCities = true;
        Location.cities(
          {
            state_id: $scope.selectedState.id,
            name: query
          },
          function (data) {
            $scope.availableCities = data;
          }, function () {
              notification.error('Error al cargar los ciudades.');
              $scope.loadingCities = false;
          });
      }
    };

    $scope.setSelectedState = function (state) {
      $scope.availableCities = [];
      $scope.selectedState = state;
      $scope.patient.city_id = null;
      $scope.availableCities = [];
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
