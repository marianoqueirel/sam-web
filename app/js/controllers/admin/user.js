'use strict';

angular.module('payeSAM.controllers')
  .controller('AdminUserCtrl', [
                                  '$rootScope',
                                  '$scope',
                                  '$http',
                                  '$location',
                                  '$uibModal',
                                  'User',
                                  'notification',
                                  'paginationLimit',
                                  'localStorageService',
                                  function (
                                    $rootScope,
                                    $scope,
                                    $http,
                                    $location,
                                    $uibModal,
                                    User,
                                    notification,
                                    paginationLimit,
                                    localStorageService
                                  ) {
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

      var _getUsers = function (page) {
        $rootScope.loading = true;
        User
          .query({
            page: $scope.pagination.currentPage,
            limit: $scope.pagination.itemsPerPage,
            searchUser: $scope.term
          }, function (response) {
            $scope.users = response.rows;
            $scope.pagination.totalItems = response.total;
            $scope.totalPages = Math.ceil(response.total / paginationLimit);
            $rootScope.loading = false;
          }, function () {
            notification.error('Error al cargar usuarios.');
            $rootScope.loading = false;
          });
      };

      $scope.init = function () {
        $scope.pagination.currentPage = parseInt($location.search().page, 10) || 1;
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

      $scope.$watch('pagination.currentPage', function() {
        _getUsers();
      });

      $scope.loginAs = function (user) {
        var confirmation = window.confirm('Esta seguro que desea cambiar de Usuario?');
        if (confirmation){
          localStorageService.remove('currentUser');
          delete $rootScope.currentUser;
          $http.defaults.headers.common['X-PAYE-SAM-ACCESS-TOKEN'] = user.access_token;
          $rootScope.currentUser = user;
          $rootScope.currentUser.timeout = +(new Date()) + 14400000;
          localStorageService.add('currentUser', user);
          $location.path('/');
        }
      };

      $scope.userTypeText = function (userType) {
        if (userType === 'Admin') { return 'Administrador'; }
        if (userType === 'Auditor') { return 'Auditor'; }
        if (userType === 'Provider') { return 'Prestador'; }
        if (userType === 'User') { return 'Usuario'; }
      };

      $scope.userTypeColor = function (userType) {
        if (userType === 'Admin') { return 'danger'; }
        if (userType === 'Auditor') { return 'warning'; }
        if (userType === 'Provider') { return 'primary'; }
        if (userType === 'User') { return 'success'; }
      };
  }]);


