(function(angular) {
    "use strict";

    function AuthService($q, afEntity, session) {

        var authObj = afEntity.set();

        this.isLoggedIn = function() {
            return session.getAuthData() !== null;
        };

        this.passwordAndEmailLogin = function(creds, options) {
            return authObj
                .$authWithPassword({
                    email: creds.email,
                    password: creds.pass
                }, {
                    remember: options.remember
                })
                .then(function(authData) {
                        session.setAuthData(authData);
                        return authData;
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        this.loginOAuth = function(provider) {
            return authObj
                .$authWithOAuthPopup(provider)
                // need to add scope
                .then(function(authData) {
                        session.setAuthData(authData);
                        return authData;
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        this.googleLogin = function() {
            this.loginOAuth("google");
        };
        this.facebookLogin = function() {
            this.loginOAuth("facebook");
        };
        this.twitterLogin = function() {
            this.loginOAuth("twitter");
        };
        this.logOut = function() {
            if (this.isLoggedIn()) {
                authObj.$unauth();
                session.destroy();
            } else {
                throw new Error("no login data found");
            }
        };
        this.changeEmail = function(creds) {
            return authObj
                .$changeEmail({
                    oldEmail: creds.oldEmail,
                    newEmail: creds.newEmail,
                    password: creds.pass
                })
                .then(function() {
                        console.log("email successfully changed");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        };
        this.resetPassword = function(creds) {
            return authObj
                .$resetPassword({
                    email: creds.email,
                })
                .then(function() {
                        console.log("password reset email sent");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        };
        this.changePassword = function(creds) {
            return authObj
                .$changePassword({
                    email: creds.email,
                    oldPassword: creds.oldPassword,
                    newPassword: creds.newPassword
                })
                .then(function() {
                        console.log("password change email sent");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        };

    }

    AuthService.$inject = ['$q', 'afEntity', 'session'];

    angular.module('srvc.auth')
        .service('auth', AuthService);


})(angular);
