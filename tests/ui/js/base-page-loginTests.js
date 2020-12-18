/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

/* global jqUnit */

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testLogin", {
        gradeNames: ["sjrk.storyTelling.base.page.login"],
        storyId: "test-id",
        members: {
            mockServer: null // to hold a reference to the mock server
        },
        pageSetup: {
            resourcePrefix: "../../../themes/base"
        },
        invokers: {
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.loginTester.stubRedirectToUrl"
            }
        },
        components: {
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

    // Main test sequences for the Login page
    fluid.defaults("sjrk.storyTelling.base.page.loginTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 6,
                sequence: [{
                    // check that the progressArea and responseArea are both hidden to begin with
                    // and that the logInButton is enabled
                    event: "{testEnvironment > sjrk.storyTelling.base.page.testLogin}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.responseArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{login}.loginUi.dom.logInButton", "disabled", false]
                },
                {
                    // test the login wiring in the successful case
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/login",
                        response: {
                            email:"rootbeer@emailforcats.meow"
                        }
                    }]
                },
                {
                    // click the login button and wait for a successful response
                    jQueryTrigger: "click",
                    element: "{login}.loginUi.dom.logInButton"
                },
                {
                    event: "{login}.events.onLogInSuccess",
                    listener: "jqUnit.assertEquals",
                    args: ["Successful server response is as expected", "rootbeer@emailforcats.meow", "{arguments}.0"]
                },
                {
                    // test the login wiring in the error case
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/login",
                        statusCode: 409,
                        response: {
                            "isError": true,
                            "message": "Another cat is using this account already"
                        }
                    }]
                },
                {
                    // click the login button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{login}.loginUi.dom.logInButton"
                },
                {
                    event: "{login}.events.onLogInError",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Error server response is as expected", "Another cat is using this account already", "{arguments}.0"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                }]
            }]
        }]
    });

    /**
     * Stubs the `redirectToUrl` function to prevent actual redirection
     *
     * @param {String} redirectUrl - the URL to redirect to
     */
    sjrk.storyTelling.base.page.loginTester.stubRedirectToUrl = function (redirectUrl) {
        jqUnit.assert("Stub for redirectToUrl was called for URL: " + redirectUrl);
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.loginTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: ".sjrkc-st-markupFixture",
        components: {
            login: {
                type: "sjrk.storyTelling.base.page.testLogin",
                createOnEvent: "{loginTester}.events.onTestCaseStart"
            },
            loginTester: {
                type: "sjrk.storyTelling.base.page.loginTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.loginTest"
        ]);
    });

})(jQuery, fluid);
