'use strict';

angular.module('payeSAM.controllers')
  .controller('PatientCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Patient', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Patient, notification, paginationLimit) {
      var _getPatients = function (page) {
        $rootScope.loading = true;
        Patient
          .query({
            page: $scope.currentPage,
            searchPatient: $scope.term
          }, function (response) {
            $scope.patients = response.rows;
            $scope.totalItems = response.count;
            $scope.totalPages = Math.ceil(response.count / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar pacientes.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getPatients($scope.currentPage);
      };

      $scope.patientModal = function (patient, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/patient-new.html',
          controller: 'PatientNewModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            patient_id: function() {
              return (patient && patient.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getPatients();
        });
      };

      $scope.searchPatient = function () {
        _getPatients();
      };

      $scope.deletePatient = function (patient) {
        var confirmation = window.confirm('Esta seguro que desea eliminar este Paciente?');

        if (confirmation) {
          $rootScope.loading = true;

          Patient
          .delete({ id: patient.id }, function () {
            notification.success('Paciente eliminado con exito.');
            _getPatients();
          }, function () {
            $rootScope.loading = false;
            notification.error('Ocurrio un error al intentar eliminar el paciente.');
          });
        }
      };
  }]);


