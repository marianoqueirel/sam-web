'use strict';

angular.module('payeSAM.controllers')
  .controller('PatientCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'Patient', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, Patient, notification, paginationLimit) {
      $scope.sort = {
        column: 'created_at',
        descending: false
      };

      $scope.pagination = {
        currentPage: 1,
        maxSize: 12,
        totalItems: 0,
        itemsPerPage: 10
      };

      var _getPatients = function (page) {
        $rootScope.loading = true;
        console.log($scope);
        Patient
          .query({
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            user_id: $scope.userId,
            searchPatient: $scope.term
          }, function (response) {
            $scope.patients = response.rows;
            $scope.users = response.users;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar pacientes.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getPatients($scope.currentPage);
      };

      $scope.patientModal = function (patient, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/patient-form.html',
          controller: 'PatientFormModalCtrl',
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

      $scope.searchPatients = function () {
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

      $scope.$watch('pagination.currentPage', function() {
        _getPatients();
      });
  }]);


