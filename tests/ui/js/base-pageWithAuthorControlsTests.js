/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the base page grade with authorControls included
    fluid.defaults("sjrk.storyTelling.base.page.testPageWithAuthorControls", {
        gradeNames: ["sjrk.storyTelling.base.page", "sjrk.storyTelling.base.page.withAuthorControls"],
        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
        pageSetup: {
            resourcePrefix: "../../../themes/base"
        },
        model: {
            persistedValues: {
                // Supply an truthy value to force rendering the logout button
                // and mimic the logged-in state
                authorAccountName: "shyguy@emailforcats.meow"
            }
        },
        members: {
            initialModel: {
                persistedValues: {
                    uiLanguage: "en"
                }
            }
        },
        listeners: {
            // Stub the page reload listener to prevent test interruption
            "onLogOutSuccess.reload": {
                funcName: "jqUnit.assertEquals",
                args: ["Page reload was called after successful logout", "/logout", "{arguments}.0"],
                // make sure the previous listener is totally deactivated
                this: null,
                method: null
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
            },
            menu: {
                container: "#testMenu"
            },
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    gradeNames: ["fluid.dataSource.writable"],
                    cookie: {
                        name: "{that}.id" // setting to the id of the component to provide a unique cookie for each run
                    }
                }
            }
        }
    });

    // Test cases and sequences for the base page logout
    fluid.defaults("sjrk.storyTelling.base.page.pageLogoutTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page logout",
            tests: [{
                name: "Test logout button wiring",
                expect: 6,
                sequence: [{
                    "event": "{pageLogoutTest testPageWithAuthorControls}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["authorAccountName is set as expected", "shyguy@emailforcats.meow", "{testPageWithAuthorControls}.model.persistedValues.authorAccountName"]
                },
                {
                    // test the logout wiring in the error case
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/logout",
                        statusCode: 500,
                        response: {
                            "isError": true,
                            "message": "Logout failed when Shyguy disconnected the cable"
                        }
                    }]
                },
                {
                    // click the logout button and wait for an error response
                    jQueryTrigger: "click",
                    element: "{testPageWithAuthorControls}.authorControls.dom.logOutButton"
                },
                {
                    event: "{testPageWithAuthorControls}.events.onLogOutError",
                    listener: "jqUnit.assertEquals",
                    args: ["Error server response is as expected", "Logout failed when Shyguy disconnected the cable", "{arguments}.0.message"]
                },
                {
                    // test the logout wiring in the successful case
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [{
                        url: "/logout",
                        response: "Log out call successful",
                        contentType: "text/plain"
                    }]
                },
                {
                    // click the logout button and wait for a successful response
                    jQueryTrigger: "click",
                    element: "{testPageWithAuthorControls}.authorControls.dom.logOutButton"
                },
                {
                    event: "{testPageWithAuthorControls}.events.onLogOutSuccess",
                    listener: "jqUnit.assertEquals",
                    args: ["Successful server response is as expected", "/logout", "{arguments}.0"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["authorAccountName is cleared as expected", null, "{testPageWithAuthorControls}.model.persistedValues.authorAccountName"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.resetCookie",
                    args: ["{testPageWithAuthorControls}.cookieStore.options.cookie.name"]
                }]
            }]
        }]
    });

    // Test environment with authorControls
    fluid.defaults("sjrk.storyTelling.base.page.pageLogoutTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: "#testPage",
        components: {
            testPageLogout: {
                type: "sjrk.storyTelling.base.page.testPageWithAuthorControls",
                container: "#testPage",
                createOnEvent: "{pageLogoutTester}.events.onTestCaseStart"
            },
            pageLogoutTester: {
                type: "sjrk.storyTelling.base.page.pageLogoutTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.pageLogoutTest"
        ]);
    });

})(jQuery, fluid);
