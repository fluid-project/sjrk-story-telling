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
            onLogInRequested: "{loginUi}.events.onLogInRequested",
            onLogInSuccess: null,
            onLogInError: null
        },
        listeners: {
            "onLogInRequested.initiateLogin": "{that}.initiateLogin",
            "onLogInSuccess.saveAuthorAccountName": {
                func: "{that}.setAuthorAccountName",
                args: ["{arguments}.0"],
                priority: "before:redirect"
            },
            "onLogInSuccess.redirect": {
                func: "{that}.redirectToUrl",
                // SJRK-403 TODO: redirect to previous page on successful login
                args: ["storyBrowse.html"],
                priority: "last"
            }
        },
        invokers: {
            initiateLogin: {
                funcName: "sjrk.storyTelling.base.page.login.initiateLogin",
                args: [
                    "{that}.options.pageSetup.logInUrl",
                    "{loginUi}.model.email",
                    "{loginUi}.model.password",
                    "{that}.events.onLogInSuccess",
                    "{that}.events.onLogInError"
                ]
            },
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.login.redirectToUrl",
                args: ["{arguments}.0"]
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

    /**
     * Calls the login endpoint on the server (provided) and fires a success or error
     * event depending on the outcome. Success event returns the email address,
     * error event returns error details
     *
     * @param {String} logInUrl - the server URL to call to start a new session
     * @param {String} email - the author's email address
     * @param {String} password - the author's password
     * @param {Object} successEvent - an infusion event to fire upon successful completion
     * @param {Object} failureEvent - an infusion event to fire on failure
     */
    sjrk.storyTelling.base.page.login.initiateLogin = function (logInUrl, email, password, successEvent, failureEvent) {
        sjrk.storyTelling.base.page.login.logIn(logInUrl, email, password).then(function (data) {
            successEvent.fire(data.email);
        }, function (jqXHR, textStatus, errorThrown) {
            failureEvent.fire({
                isError: true,
                message: sjrk.storyTelling.base.page.getErrorMessageFromXhr(jqXHR, textStatus, errorThrown)
            });
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
        return $.ajax({
            url         : logInUrl,
            data        : JSON.stringify({
                email: email,
                password: password
            }),
            cache       : false,
            contentType : "application/json",
            processData : false,
            type        : "POST"
        });
    };

    /**
     * Redirects the author to the specified URL
     *
     * @param {String} redirectUrl - the URL to redirect to
     */
    sjrk.storyTelling.base.page.login.redirectToUrl = function (redirectUrl) {
        window.location.href = redirectUrl;
    };

})(jQuery, fluid);
