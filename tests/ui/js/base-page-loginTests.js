/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testLogin", {
        gradeNames: ["sjrk.storyTelling.base.page.login"],
        storyId: "test-id",
        pageSetup: {
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
            name: "Test Login page",
            tests: [{
                name: "Test element visibility model relay and events",
                expect: 17,
                sequence: [{
                    // check that the progressArea and responseArea are both hidden to begin with
                    // and that the logInButton is enabled
                    event: "{testEnvironment > login}.events.onAllUiComponentsReady",
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
                            email: "rootbeer@emailforcats.meow"
                        }
                    }, true] // wait for response to avoid possible race with jQuery
                },
                {
                    // click the login button and wait for a successful response
                    jQueryTrigger: "click",
                    element: "{login}.loginUi.dom.logInButton"
                },
                {
                    // check that the progressArea is visible, responseArea is not
                    // and that the logInButton is disabled
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.progressArea", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.responseArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{login}.loginUi.dom.logInButton", "disabled", true]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.sendMockServerResponse"
                },
                {
                    event: "{login}.events.onLogInSuccess",
                    listener: "jqUnit.assertEquals",
                    args: ["Successful server response is as expected", "rootbeer@emailforcats.meow", "{arguments}.0"]
                },
                {
                    // check that the progressArea & responseArea are hidden
                    // and that the logInButton is re-enabled
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
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
                    // check visibility again after error message is returned
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.progressArea", "none"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementVisibility",
                    args: ["{login}.loginUi.dom.responseArea", "block"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{login}.loginUi.dom.logInButton", "disabled", false]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{login}.loginUi.dom.responseArea", "Log in failed: Another cat is using this account already"]
                },
                {
                    // set the author account name value back to its initial
                    // state in order reset the value stored in the cookie
                    func: "{login}.setAuthorAccountName",
                    args: [null]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/rootbeerSpecialUrl",
                        response: "Rootbeer has logged in",
                        contentType: "text/plain"
                    }]
                },
                {
                    task: "sjrk.storyTelling.base.page.login.logIn",
                    args: ["/rootbeerSpecialUrl", "rootbeer@emailforcats.meow", "catsDontNeedPasswords"],
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["logIn function resolved successfully with expected args", "Rootbeer has logged in", "{arguments}.0"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                }]
            }]
        }]
    });

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