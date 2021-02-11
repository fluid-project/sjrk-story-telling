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
        gradeNames: ["sjrk.storyTelling.base.page.withAuthorControls"],
        model: {
            // loginState can be one of the following values:
            // "ready" (the initial state), "requestSent", "responseReceived"
            loginState: "ready",
            loginButtonDisabled: false,
            progressAreaVisible: false,
            responseAreaVisible: false
        },
        modelListeners: {
            progressAreaVisible: {
                this: "{loginUi}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "progressAreaVisibleChange"
            },
            responseAreaVisible: {
                this: "{loginUi}.dom.responseArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "responseAreaVisibleChange"
            },
            loginButtonDisabled: {
                this: "{loginUi}.dom.logInButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "loginButtonDisabledChange"
            }
        },
        modelRelay: {
            "loginState": {
                target: "",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "loginState",
                    match: {
                        "ready": {
                            outputValue: {
                                loginButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: false
                            }
                        },
                        "requestSent": {
                            outputValue: {
                                loginButtonDisabled: true,
                                progressAreaVisible: true,
                                responseAreaVisible: false
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                loginButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: true
                            }
                        }
                    }
                }
            }
        },
        pageSetup: {
            logInUrl: "/login"
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
            // overwrite the listener to prevent losing the previous page URL
            "onCreate.setCurrentPage": null,
            "onLogInRequested.initiateLogin": "{that}.initiateLogin",
            "onLogInRequested.setStatePublishing": {
                changePath: "loginState",
                value: "requestSent",
                priority: "before:initiateLogin"
            },
            "onLogInSuccess.saveAuthorAccountName": {
                func: "{that}.setAuthorAccountName",
                args: ["{arguments}.0"],
                priority: "before:redirect"
            },
            "onLogInSuccess.setStateReady": {
                changePath: "loginState",
                value: "ready"
            },
            "onLogInSuccess.redirect": {
                func: "{that}.redirectToUrl",
                args: ["{that}.model.persistedValues.currentPage"],
                priority: "last"
            },
            "onLogInError.setStateResponseReceived": {
                changePath: "loginState",
                value: "responseReceived"
            },
            "onLogInError.setServerResponse": {
                func: "{that}.setServerResponse",
                args: ["{arguments}.0"]
            }
        },
        invokers: {
            initiateLogin: {
                funcName: "sjrk.storyTelling.base.page.login.initiateLogin",
                args: [
                    "{loginDataSource}",
                    "{loginUi}.model",
                    "{that}.events.onLogInSuccess",
                    "{that}.events.onLogInError"
                ]
            },
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.login.redirectToUrl",
                args: ["{arguments}.0"]
            },
            setServerResponse: {
                this: "{loginUi}.dom.responseText",
                method: "text",
                args: ["{arguments}.0.message"]
            }
        },
        components: {
            // the login context
            loginUi: {
                type: "sjrk.storyTelling.ui.loginUi",
                container: ".sjrkc-st-login-container"
            },
            loginDataSource: {
                type: "fluid.dataSource.URL",
                options: {
                    writable: true,
                    writeMethod: "POST",
                    listeners: {
                        "onWrite.localValidation": {
                            func: "sjrk.storyTelling.base.page.login.validation",
                            priority: "before:encoding"
                        }
                    }
                }
            }
        },
        distributeOptions: {
            "login.url": {
                source: "{that}.options.pageSetup.logInUrl",
                target: "{loginDataSource}.options.url"
            }
        }
    });

    /**
     * Calls the login dataSource and fires a success or error
     * event depending on the outcome. Success event returns the email address,
     * error event returns error details
     *
     * @param {Component} dataSource - the dataSource used to send the login request
     * @param {Object} model - the login model to send to the server for authentication
     * @param {String} model.email - the author's email address
     * @param {String} model.password - the author's password
     * @param {Object} model.validationResults - the results of the local form validation
     * @param {Object} successEvent - an infusion event to fire upon successful completion
     * @param {Object} failureEvent - an infusion event to fire on failure
     * @return {Promise} - a promise that is resolved on successful login and rejected on errors.
     */
    sjrk.storyTelling.base.page.login.initiateLogin = function (dataSource, model, successEvent, failureEvent) {
        var promise = dataSource.set({}, model);
        promise.then(function (data) {
            successEvent.fire(data.email);
        }, failureEvent.fire);
        return promise;
    };

    /**
     * Redirects the author to the specified URL
     *
     * @param {String} redirectUrl - the URL to redirect to
     */
    sjrk.storyTelling.base.page.login.redirectToUrl = function (redirectUrl) {
        window.location.href = redirectUrl;
    };

    /**
     * Ensures that login model passes local validation before sending to the server. It checks the
     * `validationResults` model path which is populated by the loginUI upon form entry. If the data passes validation,
     * the promise is resolved with the model; however, the `validationResults` are stripped out.
     *
     * @param {Object} model - the login model to send to the server for authentication
     * @param {String} model.email - the author's email address
     * @param {String} model.password - the author's password
     * @param {Object} model.validationResults - the results of the local form validation
     * @return {Promise} - a promise that is resolved if the model is valid and rejected otherwise.
     */
    sjrk.storyTelling.base.page.login.validation = function (model) {
        var promise = fluid.promise();

        if (fluid.get(model, ["validationResults", "isValid"])) {
            var acceptedModel = fluid.copy(model);
            delete acceptedModel.validationResults;
            promise.resolve(acceptedModel);
        } else {
            promise.reject(fluid.get(model, ["validationResults", "errors"]));
        }

        return promise;
    };

})(jQuery, fluid);
