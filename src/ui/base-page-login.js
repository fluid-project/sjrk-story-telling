/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The login page base grade
    fluid.defaults("sjrk.storyTelling.base.page.login", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        pageSetup: {
            logInUrl: "/authors/login"
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onLoginUiReady: "{loginUi}.events.onControlsBound"
                }
            },
            onLogIn: null
        },
        listeners: {
            "onLogIn.logIn": {
                func: "sjrk.storyTelling.base.page.login.orchestrateLogIn",
                args: ["{that}.options.pageSetup.logInUrl", "{loginUi}.model.email", "{loginUi}.model.password"]
            },
            "{loginUi}.events.onLogInRequested": {
                func: "{that}.events.onLogIn.fire",
                namespace: "escalateOnLogInRequested"
            }
        },
        components: {
            // the login context
            loginUi: {
                type: "sjrk.storyTelling.ui.loginUi",
                container: ".sjrkc-st-login-container"
            }
        }
    });

    sjrk.storyTelling.base.page.login.orchestrateLogIn = function (logInUrl, email, password) {
        var loginPromise = sjrk.storyTelling.base.page.login.logIn(logInUrl, email, password);

        loginPromise.then(function (data) {
            // send the user back to their previous location
            fluid.log(fluid.logLevel.INFO, "User was successfully logged in. Email address is:", data);
        }, function (jqXHR, textStatus, errorThrown) {
            var errorMessage = fluid.get(jqXHR, ["responseJSON", "message"]) ||
                errorThrown ||
                "Unknown server error";

            // show the error text on the page
            fluid.log(fluid.logLevel.WARN, "An error occurred while logging in:", errorMessage);
        });
    };

    /**
     * Logs the author into their account by calling the appropriate endpoint
     *
     * @param {String} logInUrl - the server URL to call to start a new session
     * @param {String} email - the author's email address
     * @param {String} password - the author's password
     *
     * @return {jqXHR} - the jqXHR for the server request
     */
    sjrk.storyTelling.base.page.login.logIn = function (logInUrl, email, password) {
        var authorCredentials = {
            email: email,
            password: password
        };

        return $.ajax({
            url         : logInUrl,
            data        : JSON.stringify(authorCredentials),
            cache       : false,
            contentType : "application/json",
            processData : false,
            type        : "POST"
        });
    };

})(jQuery, fluid);
