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
      new: {
        url: urlResources,
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
