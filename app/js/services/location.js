'use strict';

angular.module('payeSAM.services')
  .factory('Location', ['$rootScope', '$resource', 'apiUrl', function ($rootScope, $resource, apiUrl) {

    var urlResources = apiUrl + '/locations',
        urlResource  = urlResources + '/:id';

    return $resource(urlResource, {
      id: '@id'
    }, {
      states: {
        url: urlResources + '/states',
        method: 'GET',
        isArray: true
      },
      cities: {
        url: urlResources + '/cities',
        method: 'GET',
        isArray: true
      }
    });
  }
]);
