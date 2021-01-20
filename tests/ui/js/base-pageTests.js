/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the base page grade
    fluid.defaults("sjrk.storyTelling.base.page.testPage", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
        pageSetup: {
            resourcePrefix: "../../../themes/base"
        },
        listeners: {
            // Stub the page reload listener to prevent test interruption
            "onLogOutSuccess.reload": {
                funcName: "jqUnit.assertEquals",
                args: ["Page reload was called after successful logout", "/logout", "{arguments}.0"]
            }
        },
        model: {
            persistedValues: {
                // Supply an truthy value to force rendering the logout button
                // and mimic the logged-in state
                authorAccountName: "shyguy@emailforcats.meow"
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
            }
        }
    });

    // Test cases and sequences for the base page
    fluid.defaults("sjrk.storyTelling.base.page.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Test events and timing",
                expect: 15,
                sequence: [{
                    "event": "{pageTest testPage}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                // ensure the initial state is English
                {
                    func: "{testPage}.applier.change",
                    args: [["persistedValues", "uiLanguage"], ""]
                },
                {
                    func: "{testPage}.applier.change",
                    args: [["persistedValues", "uiLanguage"], "en"]
                },
                {
                    "event": "{testPage}.menu.events.onControlsBound",
                    "listener": "jqUnit.assert",
                    "args": "menu re-rendered after uiLanguage changed"
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{testPage}.menu.dom.languageLinkSpanish"
                },
                {
                    "event": "{testPage}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for Spanish button with correct args", "es", "{arguments}.0.data"]
                },
                {
                    "event": "{testPage}.menu.events.onControlsBound",
                    "listener": "jqUnit.assertEquals",
                    "args": ["menu re-rendered in Spanish after uiLanguage change to Spanish", "es", "{testPage}.menu.templateManager.model.locale"]
                },
                {
                    "event": "{testPage}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for Spanish button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "es", "{testPage}.model.persistedValues.uiLanguage"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{testPage}.menu.dom.languageLinkEnglish"
                },
                {
                    "event": "{testPage}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for English button with correct args", "en", "{arguments}.0.data"]
                },
                {
                    "event": "{testPage}.menu.events.onControlsBound",
                    "listener": "jqUnit.assertEquals",
                    "args": ["menu re-rendered in English after uiLanguage change to English", "en", "{testPage}.menu.templateManager.model.locale"]
                },
                {
                    "event": "{testPage}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for English button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "en", "{testPage}.model.persistedValues.uiLanguage"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "event": "{testPage}.events.onContextChangeRequested",
                    "listener": "jqUnit.assert",
                    "args": "onContextChangeRequested fired after menu language change"
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"es"}]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "persistedValues.uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"es", "{testPage}.model.persistedValues.uiLanguage"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "persistedValues.uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"en", "{testPage}.model.persistedValues.uiLanguage"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"cattish"}]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "persistedValues.uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"cattish", "{testPage}.model.persistedValues.uiLanguage"]
                },
                {
                    func: "{testPage}.applier.change",
                    args: [["persistedValues", "uiLanguage"], "en"]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "persistedValues.uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"en", "{testPage}.model.persistedValues.uiLanguage"]
                }]
            },
            {
                name: "Test functions and invokers",
                expect: 1,
                sequence: [{
                    "funcName": "sjrk.storyTelling.base.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"]
                },
                {
                    "event": "{testPage}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO language is correct after call to getStoredPreferences", "en", "{testPage}.uio.model.locale"]
                }]
            },
            {
                name: "Test cookieStore",
                expect: 5,
                sequence: [{
                    "func": "{testPage}.applier.change",
                    "args": [["persistedValues", "uiLanguage"], "meowish"]
                },
                {
                    "event": "{testPage}.cookieStore.events.onWriteResponse",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Cookie was saved after uiLanguage change, cookie data is as expected", "meowish", "{arguments}.0.uiLanguage"]
                },
                {
                    "func": "{testPage}.applier.change",
                    "args": [["persistedValues", "fuzzyCat"], "yes please"]
                },
                {
                    "event": "{testPage}.cookieStore.events.onWriteResponse",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Cookie was saved after new value added, cookie data is as expected", "yes please", "{arguments}.0.fuzzyCat"]
                },
                {
                    "funcName": "sjrk.storyTelling.base.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"]
                },
                {
                    "event": "{testPage}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Language is still as expected after cookie load", "meowish", "{testPage}.model.persistedValues.uiLanguage"]
                },
                // reset the cookie to its initial state for subsequent test runs
                {
                    "funcName": "sjrk.storyTelling.base.page.resetPreferences",
                    "args": ["{testPage}"]
                },
                {
                    "event": "{testPage}.events.beforePreferencesReset",
                    "listener": "jqUnit.assertNotEquals",
                    "args": ["Model is not equal to initial model before reset", "{testPage}.model", "{testPage}.initialModel"]
                },
                {
                    "event": "{testPage}.events.onPreferencesReset",
                    "listener": "jqUnit.assertDeepEq",
                    "args": ["Model is equal to initial model after reset", "{testPage}.model", "{testPage}.initialModel"]
                }]
            },
            {
                name: "Test logout button wiring",
                expect: 4,
                sequence: [{
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
                    element: "{testPage}.authorControls.dom.logOutButton"
                },
                {
                    event: "{testPage}.events.onLogOutError",
                    listener: "jqUnit.assertEquals",
                    args: ["Error server response is as expected", "Logout failed when Shyguy disconnected the cable", "{arguments}.0.message"]
                },
                // {
                //     funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                // },
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
                    element: "{testPage}.authorControls.dom.logOutButton"
                },
                {
                    event: "{testPage}.events.onLogOutSuccess",
                    listener: "jqUnit.assertEquals",
                    args: ["Successful server response is as expected", "/logout", "{arguments}.0"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["authorAccountName is cleared as expected", null, "{testPage}.model.persistedValues.authorAccountName"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                }]
            }]
        }]
    });

    /**
     * Verifies the language of the UIO component's panels
     *
     * @param {Component} pageComponent - an instance of sjrk.storyTelling.base.page
     * @param {String} expectedLanguage - the single expected langauge of all the UIO panels
     */
    sjrk.storyTelling.base.page.pageTester.verifyUioPanelLanguages = function (pageComponent, expectedLanguage) {
        if (pageComponent.uio.prefsEditorLoader.prefsEditor) {
            fluid.each(pageComponent.uio.prefsEditorLoader.prefsEditor, function (panel, key) {
                if (key.startsWith("fluid_prefs_panel_")) {
                    jqUnit.assertEquals("Language of panel '" + key + "' is as expected", expectedLanguage, panel.msgResolver.messageLanguage);
                }
            });
        } else {
            jqUnit.fail("prefsEditor component not available");
        }
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            testPage: {
                type: "sjrk.storyTelling.base.page.testPage",
                container: "#testPage",
                createOnEvent: "{pageTester}.events.onTestCaseStart"
            },
            pageTester: {
                type: "sjrk.storyTelling.base.page.pageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.pageTest"
        ]);
    });

})(jQuery, fluid);
