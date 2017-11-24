'use strict';

angular.module('payeSAM.controllers')
  .controller('AdminUserCtrl', ['$rootScope', '$scope', '$http', '$location', '$uibModal', 'User', 'notification', 'paginationLimit', function ($rootScope, $scope, $http, $location, $uibModal, User, notification, paginationLimit) {
      var _getUsers = function (page) {
        $rootScope.loading = true;
        User
          .query({
            page: $scope.currentPage,
            searchUser: $scope.term
          }, function (response) {
            $scope.users = response.rows;
            $scope.totalItems = response.count;
            $scope.totalPages = Math.ceil(response.count / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar usuarios.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.currentPage = parseInt($location.search().page, 10) || 1;
        $scope.sortBy = $location.search().sortBy || null;
        $scope.sortDir = $location.search().sortDir || 'desc';
        $scope.show = false;
        _getUsers($scope.currentPage);
      };

      $scope.userModal = function (user, show) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/admin/modals/user-form.html',
          controller: 'UserFormModalCtrl',
          size: 'lg',
          resolve: {
            show: show,
            user_id: function() {
              return (user && user.id);
            }
          }
        });

        modalInstance.result.then(function(){
          _getUsers();
        });
      };

      $scope.searchUser = function () {
        _getUsers();
      };

      $scope.deleteUser = function (user) {
        var confirmation = window.confirm('Esta seguro que desea eliminar este User?');

        if (confirmation) {
          $rootScope.loading = true;

          User
          .delete({ id: user.id }, function () {
            notification.success('User eliminado con exito.');
            _getUsers();
          }, function () {
            $rootScope.loading = false;
            notification.error('Ocurrio un error al intentar eliminar el user.');
          });
        }
      };
  }]);


