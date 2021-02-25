/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testAuthentication", {
        gradeNames: ["sjrk.storyTelling.base.page.authentication"],
        storyId: "test-id",
        pageSetup: {
            authenticationUrl: "/authentication",
            resourcePrefix: "../../../themes/base"
        },
        invokers: {
            // stub the redirectToUrl invoker & function to prevent actual redirect
            redirectToUrl: {
                funcName: "jqUnit.assertEquals",
                args: [
                    "Stub for redirectToUrl called with expected URL",
                    "{that}.model.persistedValues.currentPage", // expected URL
                    "{arguments}.0"] // redirect URL
            }
        },
        components: {
            authenticationUi: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    // since there's no dedicated "authentication" template, we'll use the login page
                                    templatePath: "%resourcePrefix/templates/login.hbs"
                                }
                            }
                        }
                    }
                }
            },
            uio: {
                options: {
                    auxiliarySchema: {
                        terms: {
                            "messagePrefix": "../../../node_modules/infusion/src/framework/preferences/messages",
                            "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html"
                        },
                        "fluid.prefs.tableOfContents": {
                            enactor: {
                                "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
                                "tocMessage": "../../../node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json"
                            }
                        }
                    }
                }
            }
        }
    });

    // Main test sequences for the Authentication page
    fluid.defaults("sjrk.storyTelling.base.page.authenticationTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testOpts: {
            credentials: {
                valid: {
                    email: "rootbeer@emailforcats.meow",
                    password: "meowmeow"
                },
                missing: {
                    email: null,
                    password: null
                },
                malformedEmail: {
                    email: "rootbeer",
                    password: "meowmeow"
                },
                shortPassword: {
                    email: "rootbeer@emailforcats.meow",
                    password: "meo"
                }
            },
            errorResponses: {
                409: {
                    isError: true,
                    message: "Conflict while executing HTTP POST on url /authentication",
                    statusCode: 409
                },
                401: {
                    isError: true,
                    message: "Unauthorized while executing HTTP POST on url /authentication",
                    statusCode: 401
                },
                malformedEmail:[{
                    dataPath: ["email"],
                    message: "fluid.schema.messages.validationErrors.format",
                    rule: {
                        format: "email",
                        required: true,
                        type: "string"
                    },
                    schemaPath: ["properties", "email", "format"]
                }],
                shortPassword: [{
                    dataPath: ["password"],
                    message: "fluid.schema.messages.validationErrors.minLength",
                    rule: {
                        format: "email",
                        minLength: 8,
                        required: true,
                        type: "string"
                    },
                    schemaPath: ["properties", "password", "minLength"]
                }],
                missing: [{
                    dataPath: ["email"],
                    message: "fluid.schema.messages.validationErrors.type",
                    rule: {
                        format: "email",
                        required: true,
                        type: "string"
                    },
                    schemaPath: ["properties", "email", "type"]
                },
                {
                    dataPath: ["password"],
                    message: "fluid.schema.messages.validationErrors.type",
                    rule: {
                        minLength: 8,
                        required: true,
                        type: "string"
                    },
                    schemaPath: ["properties", "password", "type"]
                }]
            },
            errorMessages: {
                409: "Log in failed: An account is already logged in. To log in again, please first log out.",
                401: "Log in failed: Unauthorized."
            }
        },
        modules: [{
            name: "Test Authentication page",
            tests: [{
                name: "Test element visibility model relay and events",
                expect: 33,
                sequence: [{
                    // check that the progressArea and responseArea are both hidden to begin with
                    // and that the authenticationButton is enabled
                    event: "{testEnvironment > authentication}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    // test the authentication wiring in the successful case
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/authentication",
                        response: {
                            email: "rootbeer@emailforcats.meow"
                        }
                    }, true] // wait for response to avoid possible race with jQuery
                },
                {
                    // set the authentication credentials
                    func: "{authentication}.authenticationUi.applier.change",
                    args: ["", "{that}.options.testOpts.credentials.valid"]
                },
                {
                    // click the authentication button and wait for a successful response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    // check that the progressArea is visible, responseArea is not
                    // and that the authenticationButton is disabled
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", true]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.sendMockServerResponse"
                },
                {
                    event: "{authentication}.events.onAuthenticationSuccess",
                    listener: "jqUnit.assertEquals",
                    args: ["Successful server response is as expected", "rootbeer@emailforcats.meow", "{arguments}.0"]
                },
                {
                    // check that the progressArea & responseArea are hidden
                    // and that the authenticationButton is re-enabled
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    // test the authentication wiring in the error case - already logged in
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/authentication",
                        statusCode: 409
                    }]
                },
                {
                    // click the authentication button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    event: "{authentication}.events.onAuthenticationError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "{that}.options.testOpts.errorResponses.409", "{arguments}.0"]
                },
                {
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{authentication}.authenticationUi.dom.responseText", "{that}.options.testOpts.errorMessages.409"]
                },
                {
                    // test the authentication wiring in the error case - not authorized
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/authentication",
                        statusCode: 401
                    }]
                },
                {
                    // click the authentication button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    event: "{authentication}.events.onAuthenticationError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "{that}.options.testOpts.errorResponses.401", "{arguments}.0"]
                },
                {
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{authentication}.authenticationUi.dom.responseText", "{that}.options.testOpts.errorMessages.401"]
                },
                {
                    // test the authentication wiring in the error case - malformed e-mail
                    func: "{authentication}.authenticationUi.applier.change",
                    args: ["", "{that}.options.testOpts.credentials.malformedEmail"]
                },
                {
                    // click the authentication button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    event: "{authentication}.events.onAuthenticationError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "{that}.options.testOpts.errorResponses.malformedEmail", "{arguments}.0"]
                },
                {
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    // test the authentication wiring in the error case - short password
                    func: "{authentication}.authenticationUi.applier.change",
                    args: ["", "{that}.options.testOpts.credentials.shortPassword"]
                },
                {
                    // click the authentication button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    event: "{authentication}.events.onAuthenticationError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "{that}.options.testOpts.errorResponses.shortPassword", "{arguments}.0"]
                },
                {
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    // test the authentication wiring in the error case - missing credentials
                    func: "{authentication}.authenticationUi.applier.change",
                    args: ["", "{that}.options.testOpts.credentials.missing"]
                },
                {
                    // click the authentication button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{authentication}.authenticationUi.dom.authenticationButton"
                },
                {
                    event: "{authentication}.events.onAuthenticationError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "{that}.options.testOpts.errorResponses.missing", "{arguments}.0"]
                },
                {
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{authentication}.authenticationUi.dom.responseText", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{authentication}.authenticationUi.dom.authenticationButton", "disabled", false]
                },
                {
                    // set the author account name value back to its initial
                    // state in order reset the value stored in the cookie
                    func: "{authentication}.applier.change",
                    args: ["persistedValues.authorAccountName", null]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.authenticationTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: ".sjrkc-st-markupFixture",
        components: {
            authentication: {
                type: "sjrk.storyTelling.base.page.testAuthentication",
                createOnEvent: "{authenticationTester}.events.onTestCaseStart"
            },
            authenticationTester: {
                type: "sjrk.storyTelling.base.page.authenticationTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.authenticationTest"
        ]);
    });

})(jQuery, fluid);
