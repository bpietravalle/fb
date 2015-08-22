// code (almostly entirely) from firebase/angularfire-seed repo
(function(angular) {
    "use strict";

    function fbRefFactory($window, FBURL) {
        var utils = {
            path: setPath,
            root: setRoot, 
            ref: setRef

        };

        return utils;

        function setRoot() {
            return new $window.Firebase(FBURL);
        };


        function setPath(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = setPath(args[i]);
                } else if (typeof args[i] !== 'string') {
                    throw new Error('Argument ' + i + ' to setPath is not a string: ' + args[i]);
                }
            }
            return args.join('/');
        }

        function setRef() {
            var ref = setRoot();
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                ref = ref.child(setPath(args));
            }
            return ref;
        }

    }
    fbRefFactory.$inject = ['$window', 'FBURL'];

    angular.module('utils.jsApi')
        .factory('fbRef', fbRefFactory);
})(angular);
