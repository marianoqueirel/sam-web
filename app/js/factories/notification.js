'use strict';

angular.module('payeSAM.factories')
  .service('notification', ['growl',
    function(growl) {
      this.success = function(text) {
        if (text) {
          growl.addSuccessMessage(text, { ttl: 5000 });
        }
      };

      this.error = function(text) {
        var txt = text || 'Internal Error.';

        growl.addErrorMessage(txt, { ttl: 10000 });
      };
    }
  ]);
