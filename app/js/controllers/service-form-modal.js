'use strict';

angular.module('payeSAM.controllers')
  .controller('ServiceFormModalCtrl', ['$filter', '$rootScope', '$scope', 'Service', 'ServiceType', 'Patient', '$uibModalInstance', 'notification', 'service_id', 'show', function ($filter, $rootScope, $scope, Service, ServiceType, Patient, $uibModalInstance, notification, service_id, show) {

    var loadServiceTypes = function () {
      ServiceType.query(
        {},
        function (response) {
          $scope.service_types = response;
        }
      );
    };

    $scope.init = function () {

      $scope.sending = false;
      $scope.loadingServices = false;
      $scope.loadingPatients = false;
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
            $rootScope.selectedPatients = [data.patient];
            $scope.service = data;
            $scope.service.started_at = new Date($scope.service.started_at);
            // $rootScope.selectedPatients = $scope.service;
            // $scope.setSelectedPatient();
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
      if (query && query.length >= 6) {
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

    $scope.setSelectedPatient = function (selectedPatient) {
      $scope.service.patient_id = selectedPatient.id;
      $scope.service.in_charge_dni = selectedPatient.in_charge_dni;
      $scope.service.in_charge_name = selectedPatient.in_charge_name;
      $scope.service.in_charge_relationship = selectedPatient.in_charge_relationship;
      $scope.service.in_charge_phone = selectedPatient.in_charge_phone;

      $scope.service.first_diagnosis = selectedPatient.first_diagnosis;
      $scope.service.second_diagnosis = selectedPatient.second_diagnosis;

      $scope.service.primary_doctor = selectedPatient.primary_doctor;
      $scope.service.primary_doctor_number = selectedPatient.primary_doctor_number;
      $scope.service.primary_doctor_business = selectedPatient.primary_doctor_business;
    };

    $scope.clearSelectedPatient = function () {
      $scope.service.patient_id = '';
      $scope.service.in_charge_dni = '';
      $scope.service.in_charge_name = '';
      $scope.service.in_charge_relationship = '';
      $scope.service.in_charge_phone = '';

      $scope.service.first_diagnosis = '';
      $scope.service.second_diagnosis = '';

      $scope.service.primary_doctor = '';
      $scope.service.primary_doctor_number = '';
      $scope.service.primary_doctor_business = '';
    };

    var createService = function () {
      Service.new($scope.service, function () {
        notification.success('Internacion creada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.service);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };

    var saveService = function () {
       Service.update(
        { id: $scope.service.id, service: $scope.service },
        function () {
        notification.success('Internacion guardada con exito!');

        $rootScope.loading = false;
        $scope.sending = false;

        $uibModalInstance.close($scope.service);
      }, function (err) {
        $rootScope.loading = false;
        $scope.sending = false;
        notification.error('Error.');
      });
    };


    $scope.saveForm = function () {
      $rootScope.loading = true;
      $scope.sending = true;
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
