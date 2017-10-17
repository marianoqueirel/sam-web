'use strict';

angular.module('payeSAM.services')
  .factory('Patient', ['$rootScope', '$resource', 'apiUrl', function ($rootScope, $resource, apiUrl) {

    var urlResources = apiUrl + '/patients',
        urlResource  = urlResources + '/:id';

    return $resource(urlResource, {
      id: '@id'
    }, {
      get: {
        method:'GET'
      },
      query: {
        url: urlResources,
        method: 'GET',
        isArray: false
      },
      new: {
        url: urlResources,
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      count: {
        url: urlResources + '/count',
        method: 'GET'
      }
    });
  }
]);
