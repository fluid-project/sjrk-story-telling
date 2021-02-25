/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The signup page base grade
    fluid.defaults("sjrk.storyTelling.base.page.signup", {
        gradeNames: ["sjrk.storyTelling.base.page.authentication"],
        pageSetup: {
            authenticationUrl: "/signup"
        },
        validationErrorMapping: {
            error_password_confirmation_blank: "properties.confirm.type",
            error_password_confirmation_length: "properties.confirm.minLength",
            error_password_confirmation_mismatch: "properties.confirmComparison.type"
        },
        model: {
            confirmErrorMessage: "",
            confirmComparisonErrorMessage: ""
        },
        modelListeners: {
            confirmErrorMessage: {
                this: "{authenticationUi}.dom.passwordConfirmationErrorText",
                method: "text",
                args: ["{change}.value"],
                namespace: "confirmErrorMessageUpdate"
            },
            confirmComparisonErrorMessage: {
                this: "{authenticationUi}.dom.passwordConfirmationComparisonErrorText",
                method: "text",
                args: ["{change}.value"],
                priority: "after:confirmErrorMessageUpdate",
                namespace: "confirmComparisonErrorMessageUpdate"
            }
        },
        listeners: {
            "onAuthenticationRequested.resetPasswordConfirmationErrorMessage": {
                func: "{that}.resetPasswordConfirmationErrorMessage",
                priority: "before:setStateRequestSent"
            },
            "onAuthenticationRequested.resetPasswordConfirmationComparisonErrorMessage": {
                func: "{that}.resetPasswordConfirmationComparisonErrorMessage",
                priority: "before:setStateRequestSent"
            }
        },
        invokers: {
            // resets the password confirmation error message
            resetPasswordConfirmationErrorMessage: {
                changePath: "confirmErrorMessage",
                value: ""
            },
            // resets the password confirmation comparison error message
            resetPasswordConfirmationComparisonErrorMessage: {
                changePath: "confirmComparisonErrorMessage",
                value: ""
            }
        },
        components: {
            authenticationUi: {
                options: {
                    modelSchema: {
                        properties: {
                            confirm: {
                                type: "string",
                                required: true,
                                minLength: 8
                            },
                            confirmComparison: {
                                type: "boolean",
                                required: true
                            }
                        }
                    },
                    model: {
                        confirm: null, // the new author's password confirmation
                        confirmComparison: null // the intermediate comparison holder
                    },
                    modelListeners: {
                        confirmComparison: {
                            this: "console",
                            method: "log",
                            args: ["comparison from", "{change}.oldValue", "to", "{change}.value"]
                        }
                    },
                    modelRelay: {
                        uploadCountersToPreviewingDisabled: {
                            target: "confirmComparison",
                            singleTransform: {
                                type: "fluid.transforms.condition",
                                condition: {
                                    transform: {
                                        type: "fluid.transforms.binaryOp",
                                        left: "{that}.model.password",
                                        right: "{that}.model.confirm",
                                        operator: "==="
                                    }
                                },
                                backwards: "never",
                                true: true,
                                false: null
                            }
                        }
                    },
                    selectors: {
                        passwordConfirmationInput: ".sjrkc-st-authentication-password-confirmation-input",
                        passwordConfirmationErrorText: ".sjrkc-st-authentication-error-password-confirmation",
                        passwordConfirmationComparisonErrorText: ".sjrkc-st-authentication-error-password-confirmation-comparison"
                    },
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    // SJRK-340: this would be a perfect example
                                    // of why this Jira exists
                                    templatePath: "%resourcePrefix/templates/signup.hbs"
                                }
                            }
                        },
                        binder: {
                            options: {
                                bindings: {
                                    passwordConfirmationInput: "confirm"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
