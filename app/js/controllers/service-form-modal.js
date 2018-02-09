'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceFormModalCtrl', [
    '$rootScope',
    '$scope',
    'Service',
    'ServiceType',
    'Patient',
    'Location',
    '$uibModalInstance',
    'notification',
    'service_id',
    'show',
    function (
      $rootScope,
      $scope,
      Service,
      ServiceType,
      Patient,
      Location,
      $uibModalInstance,
      notification,
      service_id,
      show
    )
  {
    var loadServiceTypes = function () {
      ServiceType.query(
        {},
        function (response) {
          $scope.service_types = response;
        }
      );
    };

    var loadStateAndCity = function () {
      if ($scope.service.city_id)
      {
        Location.state({city_id: $scope.service.city_id }, function (response) {
            $scope.selectedState = response;
          }, function () {
            notification.error('Error al cargar provincia');
          }
        );
        Location.city({ city_id: $scope.service.city_id }, function (response) {
            $scope.service.city_id = response;
          }, function () {
            notification.error('Error al cargar ciudad');
          }
        );
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

    $scope.init = function () {
      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;
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
      $scope.service = {};
      if (service_id) {
        if (!show) {
          $scope.action = 'edit';
        }
        Service.get(
          { id: service_id },
          function (data) {
            $scope.availablePatients = [data.patient];
            $scope.setSelectedPatient(data.patient);
            $scope.selectedPatient = data.patient;
            $scope.service = data;
            $scope.service.started_at = new Date($scope.service.started_at);
            loadStateAndCity();
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
        loadServiceTypes();
    };

    $scope.listPatients = function (query) {
      $scope.availablePatients = [];
      if (query && query.length >= 3) {
        $scope.loadingPatients = true;
        Patient
          .query({
            page: 1,
            searchPatient: query
          }, function (response) {
            $scope.availablePatients = response.rows;
            $scope.loadingPatients = false;
          }, function () {
            notification.error('Error al cargar los pacientes.');
            $scope.loadingPatients = false;
          });
      }
    };

    var setCityId = function () {
      if ($scope.service.city_id)
      {
        $scope.service.city_id = $scope.service.city_id.id;
      }
    };

    var setPlace = function () {
      if ($scope.service.service_type_id === 1){
        $scope.service.place = $scope.place;
      } else {
        $scope.service.place = null;
      }
    };

    $scope.updatePlace = function () {
      setPlace();
    };

    $scope.setSelectedPatient = function (selectedPatient) {
      if (selectedPatient) {
        $scope.service.patient_id = selectedPatient.id;
        $scope.service.diagnosis = selectedPatient.diagnosis;
        $scope.service.phone = selectedPatient.phone;
        $scope.place = selectedPatient.address;
        setPlace();
      }
    };

    $scope.clearSelectedPatient = function () {
      $scope.service.patient_id = '';
      $scope.service.diagnosis = '';
    };

    var createService = function () {
      Service.new($scope.service, function () {
        notification.success('Prestación creada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.service);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveService = function () {
       Service.update(
        { id: $scope.service.id, service: $scope.service },
        function () {
        notification.success('Prestación guardada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.service);
      }, function (err) {
        $scope.form_errors = err.data.errors;
        $rootScope.loading = false;
        $scope.sending = false;
        loadStateAndCity();
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
      setCityId();
      if ($scope.action === 'create') {
        createService();
      } else {
        saveService();
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  }
]);
