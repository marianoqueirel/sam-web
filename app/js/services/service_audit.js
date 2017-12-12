'use strict';

angular.module('payeSAM.services')
  .factory('ServiceAudit', ['$rootScope', '$resource', 'apiUrl', function ($rootScope, $resource, apiUrl) {

    var urlResources = apiUrl + '/service_audits',
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
      markAsPayed: {
        url: urlResource + '/mark_as_payed',
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
]);
