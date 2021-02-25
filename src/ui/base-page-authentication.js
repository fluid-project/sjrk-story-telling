/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The authentication page base grade
    //
    // This grade is intended to supply the shared components, events and other
    // wiring for the login and signup pages. The name isn't ideal, but it'll do
    fluid.defaults("sjrk.storyTelling.base.page.authentication", {
        gradeNames: ["sjrk.storyTelling.base.page.withAuthorControls"],
        model: {
            // authenticationState can be one of the following values:
            // "ready" (the initial state), "requestSent", "responseReceived"
            authenticationState: "ready",
            authenticationButtonDisabled: false,
            progressAreaVisible: false,
            serverResponseText: false,
            emailErrorMessage: "",
            passwordErrorMessage: ""
        },
        modelListeners: {
            progressAreaVisible: {
                this: "{authenticationUi}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "progressAreaVisibleChange"
            },
            authenticationButtonDisabled: {
                this: "{authenticationUi}.dom.authenticationButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "authenticationButtonDisabledChange"
            },
            serverResponseText: {
                this: "{authenticationUi}.dom.responseText",
                method: "text",
                args: ["{change}.value"],
                namespace: "serverResponseTextChange"
            },
            emailErrorMessage: {
                this: "{authenticationUi}.dom.emailErrorText",
                method: "text",
                args: ["{change}.value"],
                namespace: "emailErrorMessageUpdate"
            },
            passwordErrorMessage: {
                this: "{authenticationUi}.dom.passwordErrorText",
                method: "text",
                args: ["{change}.value"],
                namespace: "passwordErrorMessageUpdate"
            }
        },
        modelRelay: {
            "authenticationState": {
                target: "",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "authenticationState",
                    match: {
                        "ready": {
                            outputValue: {
                                authenticationButtonDisabled: false,
                                progressAreaVisible: false
                            }
                        },
                        "requestSent": {
                            outputValue: {
                                authenticationButtonDisabled: true,
                                progressAreaVisible: true
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                authenticationButtonDisabled: false,
                                progressAreaVisible: false
                            }
                        }
                    }
                }
            }
        },
        pageSetup: {
            authenticationUrl: null // to be supplied by implementing grade
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onAuthenticationUiReady: "{authenticationUi}.events.onControlsBound"
                }
            },
            onAuthenticationRequested: "{authenticationUi}.events.onAuthenticationRequested",
            onAuthenticationSuccess: null,
            onAuthenticationError: null
        },
        listeners: {
            // overwrite the listener to prevent losing the previous page URL
            "onCreate.setCurrentPage": null,
            "onAuthenticationRequested.resetEmailErrorMessage": {
                func: "{that}.resetEmailErrorMessage",
                priority: "before:setStateRequestSent"
            },
            "onAuthenticationRequested.resetPasswordErrorMessage": {
                func: "{that}.resetPasswordErrorMessage",
                priority: "before:setStateRequestSent"
            },
            "onAuthenticationRequested.resetServerErrorMessage": {
                func: "{that}.setServerResponse",
                args: [""],
                priority: "before:setStateRequestSent"
            },
            "onAuthenticationRequested.setStateRequestSent": {
                changePath: "authenticationState",
                value: "requestSent",
                priority: "before:initiateAuthentication"
            },
            "onAuthenticationRequested.initiateAuthentication": "{that}.initiateAuthentication",
            "onAuthenticationSuccess.saveAuthorAccountName": {
                changePath: "persistedValues.authorAccountName",
                value: "{arguments}.0",
                priority: "before:redirect",
                source: "login"
            },
            "onAuthenticationSuccess.setStateReady": {
                changePath: "authenticationState",
                value: "ready"
            },
            "onAuthenticationSuccess.redirect": {
                func: "{that}.redirectToUrl",
                args: ["{that}.model.persistedValues.currentPage"],
                priority: "last"
            },
            "onAuthenticationError.setStateResponseReceived": {
                changePath: "authenticationState",
                value: "responseReceived"
            },
            "onAuthenticationError.displayAuthenticationErrors": {
                funcName: "{that}.displayAuthenticationErrors",
                args: ["{arguments}.0"]
            }
        },
        invokers: {
            // initiates the authentication process (server call, etc.)
            initiateAuthentication: {
                funcName: "sjrk.storyTelling.base.page.authentication.initiateAuthentication",
                args: [
                    "{authenticationDataSource}",
                    "{authenticationUi}.model",
                    "{that}.events.onAuthenticationSuccess",
                    "{that}.events.onAuthenticationError"
                ]
            },
            // redirects the user to the specified URL
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.authentication.redirectToUrl",
                args: ["{arguments}.0"]
            },
            // sets the server response area text
            setServerResponse: {
                this: "{authenticationUi}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            },
            // shows the appropriate authentication error(s), be they validation or server
            displayAuthenticationErrors: {
                funcName: "sjrk.storyTelling.base.page.authentication.displayAuthenticationErrors",
                args: ["{that}", "{arguments}.0"] // authenticationResponse
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
                funcName: "sjrk.storyTelling.base.page.authentication.getLocalizedServerErrorMessage",
                args: [
                    "{that}",
                    "{arguments}.0", // error
                    "{authenticationUi}.templateManager.templateStrings.localizedMessages.authenticationServerErrors"
                ]
            },
            // gets a single localized error message from a given validation error
            getLocalizedValidationErrorMessage: {
                funcName: "sjrk.storyTelling.base.page.authentication.getLocalizedValidationErrorMessage",
                args: [
                    "{that}",
                    "{arguments}.0", // error
                    "{authenticationUi}.templateManager.templateStrings.localizedMessages.authenticationValidationErrors",
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
            // the authentication context
            authenticationUi: {
                type: "sjrk.storyTelling.ui.authenticationUi",
                container: ".sjrkc-st-authentication-container"
            },
            authenticationDataSource: {
                type: "fluid.dataSource.URL",
                options: {
                    writable: true,
                    writeMethod: "POST",
                    listeners: {
                        "onWrite.localValidation": {
                            func: "sjrk.storyTelling.base.page.authentication.validation",
                            priority: "before:encoding"
                        }
                    }
                }
            }
        },
        distributeOptions: {
            "authentication.url": {
                source: "{that}.options.pageSetup.authenticationUrl",
                target: "{authenticationDataSource}.options.url"
            }
        }
    });

    /**
     * Calls the authentication dataSource and fires a success or error
     * event depending on the outcome. Success event returns the email address,
     * error event returns error details
     *
     * @param {Component} dataSource - the dataSource used to send the authentication request
     * @param {Object} model - the authentication model to send to the server for authentication
     * @param {String} model.email - the author's email address
     * @param {String} model.password - the author's password
     * @param {Object} model.validationResults - the results of the local form validation
     * @param {Object} successEvent - an infusion event to fire upon successful completion
     * @param {Object} failureEvent - an infusion event to fire on failure
     * @return {Promise} - a promise that is resolved on successful authentication and rejected on errors.
     */
    sjrk.storyTelling.base.page.authentication.initiateAuthentication = function (dataSource, model, successEvent, failureEvent) {
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
    sjrk.storyTelling.base.page.authentication.redirectToUrl = function (redirectUrl) {
        window.location.href = redirectUrl;
    };

    /**
     * Ensures that authentication model passes local validation before sending to the server. It checks the
     * `validationResults` model path which is populated by the authenticationUI upon form entry. If the data passes validation,
     * the promise is resolved with the model; however, the `validationResults` are stripped out.
     *
     * @param {Object} model - the authentication model to send to the server for authentication
     * @param {String} model.email - the author's email address
     * @param {String} model.password - the author's password
     * @param {Object} model.validationResults - the results of the local form validation
     * @return {Promise} - a promise that is resolved if the model is valid and rejected otherwise.
     */
    sjrk.storyTelling.base.page.authentication.validation = function (model) {
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
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.authentication`
     * @param {Object} authenticationResponse - either a server response containing an
     *      HTTP status code and error message, or a `fluid-json-schema`
     *      validation error collection
     */
    sjrk.storyTelling.base.page.authentication.displayAuthenticationErrors = function (that, authenticationResponse) {
        if (authenticationResponse.isError) {
            // if it's an infusion-style error, assume it's a server error &
            // show the message
            that.setServerResponse(that.getLocalizedServerErrorMessage(authenticationResponse));
        } else {
            // if it's not an infusion-style error, assume it's validation errors

            // show the general validation error message
            that.setServerResponse(that.getLocalizedServerErrorMessage({statusCode: "error_validation"}));

            fluid.each(authenticationResponse, function (error) {
                that.applier.change([error.dataPath[0] + "ErrorMessage"], that.getLocalizedValidationErrorMessage(error));
            });
        }
    };

    /**
     * Given a server response error, returns the associated localized error message string.
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.authentication`
     * @param {Object} error - a single server error
     * @param {String[]} localizedErrorMessages - a collection of localized error messages
     * @return {String} - the localized error message
     */
    sjrk.storyTelling.base.page.authentication.getLocalizedServerErrorMessage = function (that, error, localizedErrorMessages) {
        // check the status code
        // if it's 401 or 409, get the string
        // if it's something else or missing, show general error message
        var errorMessage = localizedErrorMessages.error_undefined;

        switch (error.statusCode) {
        case "error_validation":
            errorMessage = localizedErrorMessages.error_validation;
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
     * @param {Component} that - an instance of `sjrk.storyTelling.base.page.authentication`
     * @param {Object} error - a single validation error record
     * @param {String[]} localizedErrorMessages - a collection of localized error messages
     * @param {Object} validationErrorMapping - a mapping of localized error message names to validator schema paths
     *     @see the component option "validationErrorMapping" for details
     * @return {String} - the localized error message
     */
    sjrk.storyTelling.base.page.authentication.getLocalizedValidationErrorMessage = function (that, error, localizedErrorMessages, validationErrorMapping) {
        var joinedSchemaPath = error.schemaPath.join(".");
        var messageKey = fluid.keyForValue(validationErrorMapping, joinedSchemaPath);
        return localizedErrorMessages[messageKey];
    };

})(jQuery, fluid);
