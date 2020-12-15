/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI representing the "author controls" part of every page
    fluid.defaults("sjrk.storyTelling.ui.authorControls", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            logOutButton: ".sjrkc-st-author-log-out"
        },
        events: {
            onLogOutRequested: null
        },
        listeners: {
            "onReadyToBind.bindLogOutButton": {
                "this": "{that}.dom.logOutButton",
                "method": "click",
                "args": ["{that}.events.onLogOutRequested.fire"]
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/authorControls.hbs"
                    }
                }
            }
        }
    });

    // a UI representing the "login" form of the login page
    fluid.defaults("sjrk.storyTelling.ui.loginUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
        model: {
            email: null, // the author's email
            password: null // the author's password
        },
        selectors: {
            logInButton: ".sjrkc-st-login-button",
            emailInput: ".sjrkc-st-login-email-input",
            passwordInput: ".sjrkc-st-login-password-input"
        },
        events: {
            onLogInRequested: null
        },
        listeners: {
            "onReadyToBind.bindLogInButton": {
                "this": "{that}.dom.logInButton",
                "method": "click",
                "args": ["{that}.events.onLogInRequested.fire"]
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/login.hbs"
                    }
                }
            },
            // for binding the input fields to the data model
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{loginUi}.container",
                options: {
                    model: "{loginUi}.model",
                    selectors: "{loginUi}.options.selectors",
                    listeners: {
                        "{loginUi}.events.onReadyToBind": {
                            func: "{that}.events.onUiReadyToBind",
                            namespace: "applyLoginUiBinding"
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
