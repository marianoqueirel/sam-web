'use strict';

angular.module('payeSAM.directives')
  .directive('alerts', [function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/templates/alerts.html',
      scope: {
        messages: '=messages'
      }
    };
  }
]);
