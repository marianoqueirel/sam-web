'use strict';

angular.module('payeSAM.services')
  .factory('Provider', ['$rootScope', '$resource', 'apiUrl', function ($rootScope, $resource, apiUrl) {

    var urlResources = apiUrl + '/providers',
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
      for_select: {
        url: urlResources + '/for_select',
        method: 'GET',
        isArray: true
      },
      new: {
        url: urlResources,
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      add_companies: {
        url: urlResource + '/add_companies',
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
