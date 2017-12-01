'use strict';

angular.module('payeSAM.services')
  .factory('Service', ['$rootScope', '$resource', 'apiUrl', function ($rootScope, $resource, apiUrl) {

    var urlResources = apiUrl + '/services',
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
      },
      requireAudit: {
        url: urlResource + '/require_audit',
        method: 'POST'
      }
    });
  }
]);
