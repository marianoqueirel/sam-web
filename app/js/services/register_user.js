'use strict';

angular.module('payeSAM.services')
  .factory('RegisterUser', ['$rootScope', '$resource', 'apiUrl',
    function($rootScope, $resource, apiUrl) {

      var urlResource = apiUrl + '/auth/signup';

      return $resource(urlResource, {}, {
        new: {
          url: urlResource,
          method: 'POST'
        }
      });
    }
  ]);
