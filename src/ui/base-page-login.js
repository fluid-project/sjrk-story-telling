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
            serverResponseText: false,
            emailErrorMessage: "",
            passwordErrorMessage: ""
        },
        modelListeners: {
            progressAreaVisible: {
                this: "{loginUi}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "progressAreaVisibleChange"
            },
            loginButtonDisabled: {
                this: "{loginUi}.dom.logInButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "loginButtonDisabledChange"
            },
            serverResponseText: {
                this: "{loginUi}.dom.responseText",
                method: "text",
                args: ["{change}.value"],
                namespace: "serverResponseTextChange"
            },
            emailErrorMessage: {
                this: "{loginUi}.dom.emailErrorText",
                method: "text",
                args: ["{change}.value"],
                namespace: "emailErrorMessageUpdate"
            },
            passwordErrorMessage: {
                this: "{loginUi}.dom.passwordErrorText",
                method: "text",
                args: ["{change}.value"],
                namespace: "passwordErrorMessageUpdate"
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
                                progressAreaVisible: false
                            }
                        },
                        "requestSent": {
                            outputValue: {
                                loginButtonDisabled: true,
                                progressAreaVisible: true
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                loginButtonDisabled: false,
                                progressAreaVisible: false
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
            "onLogInRequested.resetEmailErrorMessage": {
                func: "{that}.resetEmailErrorMessage",
                priority: "before:setStateRequestSent"
            },
            "onLogInRequested.resetPasswordErrorMessage": {
                func: "{that}.resetPasswordErrorMessage",
                priority: "before:setStateRequestSent"
            },
            "onLogInRequested.resetServerErrorMessage": {
                func: "{that}.setServerResponse",
                args: [""],
                priority: "before:setStateRequestSent"
            },
            "onLogInRequested.setStateRequestSent": {
                changePath: "loginState",
                value: "requestSent",
                priority: "before:initiateLogin"
            },
            "onLogInRequested.initiateLogin": "{that}.initiateLogin",
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
            "onLogInError.displayLoginErrors": {
                funcName: "{that}.displayLoginErrors",
                args: ["{arguments}.0"]
            }
        },
        invokers: {
            // initiates the login process (server call, etc.)
            initiateLogin: {
                funcName: "sjrk.storyTelling.base.page.login.initiateLogin",
                args: [
                    "{loginDataSource}",
                    "{loginUi}.model",
                    "{that}.events.onLogInSuccess",
                    "{that}.events.onLogInError"
                ]
            },
            // redirects the user to the specified URL
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.login.redirectToUrl",
                args: ["{arguments}.0"]
            },
            // sets the server response area text
            setServerResponse: {
                this: "{loginUi}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            },
            // shows the appropriate login error(s), be they validation or server
            displayLoginErrors: {
                funcName: "sjrk.storyTelling.base.page.login.displayLoginErrors",
                args: ["{that}", "{arguments}.0"] // loginResponse
            },
            // resets the email error message
            resetEmailErrorMessage: {
                changePath: "emailErrorMessage",
                value: ""
            },
            // resets the password error message
            resetPasswordErrorMessage: {
                changePath: "passwordErrorMessage",
                value: ""
            },
            // gets a single localized error message from a given server error
            getLocalizedServerErrorMessage: {
                funcName: "sjrk.storyTelling.base.page.login.getLocalizedServerErrorMessage",
                args: [
                    "{that}",
                    "{arguments}.0", // error
                    "{loginUi}.templateManager.templateStrings.localizedMessages.loginServerErrors"
                ]
            },
            // gets a single localized error message from a given validation error
            getLocalizedValidationErrorMessage: {
                funcName: "sjrk.storyTelling.base.page.login.getLocalizedValidationErrorMessage",
                args: [
                    "{that}",
                    "{arguments}.0", // error
                    "{loginUi}.templateManager.templateStrings.localizedMessages.loginValidationErrors",
                    "{that}.options.validationErrorMapping"
                ]
            }
        },
        validationErrorMapping: {
            /*
             * this collection is meant to map the localized error message keys
             * to their corresponding validationResults error paths
             * the format is:
             *
             * localized_error_message_name: "error.schema.path"
             */
            error_email_blank: "properties.email.required",
            error_email_format: "properties.email.format",
            error_email_length: "properties.email.minLength",
            error_password_blank: "properties.password.required",
            error_password_length: "properties.password.minLength"
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

    /**
     * Processes the input validation results and displays a localized summary
     * of validation errors if the input is not valid
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.login`
     * @param {Object} loginResponse - either a server response containing an
     *      HTTP status code and error message, or a `fluid-json-schema`
     *      validation error collection
     */
    sjrk.storyTelling.base.page.login.displayLoginErrors = function (that, loginResponse) {
        if (loginResponse.isError) {
            // if it's an infusion-style error, assume it's a server error &
            // show the message
            that.setServerResponse(that.getLocalizedServerErrorMessage(loginResponse));
        } else {
            // if it's not an infusion-style error, assume it's validation errors
            fluid.each(loginResponse, function (error) {
                that.applier.change([error.dataPath + "ErrorMessage"], that.getLocalizedValidationErrorMessage(error));
            });
        }
    };

    /**
     * Given a server response error, returns the associated localized error message string.
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.login`
     * @param {Object} error - a single server error
     * @param {String[]} localizedErrorMessages - a collection of localized error messages
     * @return {String} - the localized error message
     */
    sjrk.storyTelling.base.page.login.getLocalizedServerErrorMessage = function (that, error, localizedErrorMessages) {
        // check the status code
        // if it's 401 or 409, get the string
        // if it's something else or missing, show general error message
        var errorMessage = localizedErrorMessages.undefinedError;

        switch (error.statusCode) {
        case 400:
        case 401:
        case 409:
            errorMessage = localizedErrorMessages[error.statusCode];
            break;
        }

        return errorMessage;
    };

    /**
     * Given an error record from `fluid-json-schema`, returns the associated
     * localized error message string.
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.login`
     * @param {Object} error - a single validation error record
     * @param {String[]} localizedErrorMessages - a collection of localized error messages
     * @param {Object} validationErrorMapping - a mapping of localized error message names to validator schema paths
     *     @see the component option "validationErrorMapping" for details
     * @return {String} - the localized error message
     */
    sjrk.storyTelling.base.page.login.getLocalizedValidationErrorMessage = function (that, error, localizedErrorMessages, validationErrorMapping) {
        var joinedSchemaPath = error.schemaPath.join(".");
        var messageKey = fluid.keyForValue(validationErrorMapping, joinedSchemaPath);
        return localizedErrorMessages[messageKey];
    };

})(jQuery, fluid);
