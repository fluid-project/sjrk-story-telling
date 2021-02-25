/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI representing the "authentication" form of authentication pages
    fluid.defaults("sjrk.storyTelling.ui.authenticationUi", {
        gradeNames: ["sjrk.storyTelling.ui", "fluid.schema.modelComponent"],
        modelSchema: {
            "$schema": "fss-v7-full#",
            type: "object",
            properties: {
                email: {
                    type: "string",
                    required: true,
                    format: "email"
                },
                password: {
                    type: "string",
                    required: true,
                    minLength: 8
                }
            }
        },
        model: {
            email: null, // the author's email
            password: null // the author's password
        },
        selectors: {
            authenticationButton: ".sjrkc-st-authentication-button",
            emailInput: ".sjrkc-st-authentication-email-input",
            emailErrorText: ".sjrkc-st-authentication-error-email",
            passwordInput: ".sjrkc-st-authentication-password-input",
            passwordErrorText: ".sjrkc-st-authentication-error-password",
            progressArea: ".sjrkc-st-authentication-progress",
            responseText: ".sjrkc-st-authentication-response"
        },
        events: {
            onAuthenticationRequested: null
        },
        listeners: {
            "onReadyToBind.bindAuthenticationButton": {
                "this": "{that}.dom.authenticationButton",
                "method": "click",
                "args": ["{that}.events.onAuthenticationRequested.fire"],
                "priority": "before:fireOnControlsBound"
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: null // to be supplied by the implementing grade
                    }
                }
            },
            // for binding the input fields to the data model
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{authenticationUi}.container",
                options: {
                    model: "{authenticationUi}.model",
                    selectors: "{authenticationUi}.options.selectors",
                    listeners: {
                        "{authenticationUi}.events.onReadyToBind": {
                            func: "{that}.events.onUiReadyToBind",
                            namespace: "applyAuthenticationUiBinding"
                        }
                    },
                    bindings: {
                        emailInput: "email",
                        passwordInput: "password"
                    }
                }
            }
        }
    });
})(jQuery, fluid);
