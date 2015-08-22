(function(angular) {
    "use strict";

    describe('fbRef', function() {
        var fbRef, FBURL;
        beforeEach(function() {
            MockFirebase.override();
            module('fb.utils');
        });
        beforeEach(inject(function(_fbRef_, _FBURL_) {
            fbRef = _fbRef_;
            FBURL = _FBURL_;
        }));

        it("should exist", function() {
            expect(fbRef).toBeDefined();
        });

        describe('path', function() {
            it("returns the correct string", function() {
                var url = ["a_string", "another"];
                expect(fbRef.path(url)).toEqual("a_string/another");
            });
						// it("throws an error if args !== array", function(){
						// });
        });
        describe('ref', function() {
            it("fbRef.ref is a function", function() {
                expect(typeof fbRef.ref).toBe('function');
            });

            it("ref.path returns correct URL with child path", function() {
                var url = "a_string";
                var test = fbRef.ref(url);
                expect(test.path).toEqual('https://your-firebase.firebaseio.com/a_string');
            });
            it("ref.path returns parent URL if no child path given", function() {
                var test = fbRef.ref();
                expect(test.path).toEqual(FBURL);
            });
            it("ref.path returns correct URL when path = array", function() {
                var test = fbRef.ref('users', 'phones', '15');
                expect(test.path).toEqual('https://your-firebase.firebaseio.com/users/phones/15');
            });
            //not passing below - matcher syntax
            // it("ref.path throws error if path array item isn't a string", function() {
            //     var fn = fbRef.ref('users', 'phones', 15);
            //     expect(fn).toThrowError();
            // });
        });
    });
})(angular);
