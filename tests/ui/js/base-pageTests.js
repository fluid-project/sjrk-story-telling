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
        model: {
            persistedValues: {
                uiLanguage: "en"
            }
        },
        members: {
            initialModel: {
                persistedValues: {
                    uiLanguage: "en"
                }
            },
            record: {}
        },
        listeners: {
            "onPreferencesLoaded.record": {
                funcName: "fluid.set",
                args: ["{that}", ["record", "onPreferencesLoaded"], true],
                priority: "first"
            },
            "onPreferenceLoadFailed.record": {
                funcName: "fluid.set",
                args: ["{that}", ["record", "onPreferenceLoadFailed"], "{arguments}.0"],
                priority: "first"
            },
            "beforePreferencesReset.record": {
                funcName: "fluid.set",
                args: ["{that}", ["record", "beforePreferencesReset"], "{arguments}.0"],
                priority: "first"
            },
            "onPreferencesReset.record": {
                funcName: "fluid.set",
                args: ["{that}", ["record", "onPreferencesReset"], "{arguments}.0"],
                priority: "first"
            },
            "onContextChangeRequested.record": {
                funcName: "fluid.set",
                args: ["{that}", ["record", "onContextChangeRequested"], "{arguments}.0"],
                priority: "first"
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

    // Test cases and sequences for the base page
    fluid.defaults("sjrk.storyTelling.base.page.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Initialization",
                expect: 5,
                sequence: [{
                    "event": "{pageTest testPage}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "On initializations the onAllUiComponentsReady event is fired"
                },
                // ensure the initial state is English
                {
                    funcName: "sjrk.storyTelling.base.page.pageTester.verifyLanguageState",
                    args: ["{testPage}", "en"]
                },
                {
                    task: "{testPage}.cookieStore.get",
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["Initial cookie set", "{testPage}.model.persistedValues", "{arguments}.0"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
                }]
            }, {
                name: "Click to change language",
                expect: 10,
                sequence: [{
                    "jQueryTrigger": "click",
                    "element": "{testPage}.menu.dom.languageLinkSpanish"
                },
                // ensure the new state is Spanish
                {
                    event: "{testPage}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.base.page.pageTester.verifyLanguageState",
                    args: ["{testPage}", "es"],
                    priority: "last:testing"
                },
                {
                    task: "{testPage}.cookieStore.get",
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The uiLanguage value should be set to: es", "es", "{arguments}.0.uiLanguage"]
                },
                {
                    "funcName": "jqUnit.assertNotUndefined",
                    "args": ["onContextChangeRequested event fired", "{testPage}.record.onContextChangeRequested"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
                },
                // change language to English
                {
                    "jQueryTrigger": "click",
                    "element": "{testPage}.menu.dom.languageLinkEnglish"
                },
                // ensure the new state is English
                {
                    event: "{testPage}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.base.page.pageTester.verifyLanguageState",
                    args: ["{testPage}", "en"],
                    priority: "last:testing"
                },
                {
                    task: "{testPage}.cookieStore.get",
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The uiLanguage value should be set to: en", "en", "{arguments}.0.uiLanguage"]
                },
                {
                    "funcName": "jqUnit.assertNotUndefined",
                    "args": ["onContextChangeRequested event fired", "{testPage}.record.onContextChangeRequested"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
                }]
            }, {
                name: "Change langauge via model",
                expect: 10,
                sequence: [{
                    func: "{testPage}.applier.change",
                    args: [["persistedValues", "uiLanguage"], "es"]
                },
                // ensure the new state is Spanish
                {
                    event: "{testPage}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.base.page.pageTester.verifyLanguageState",
                    args: ["{testPage}", "es"],
                    priority: "last:testing"
                },
                {
                    task: "{testPage}.cookieStore.get",
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The uiLanguage value should be set to: es", "es", "{arguments}.0.uiLanguage"]
                },
                {
                    "funcName": "jqUnit.assertNotUndefined",
                    "args": ["onContextChangeRequested event fired", "{testPage}.record.onContextChangeRequested"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
                },
                // change language to English
                {
                    func: "{testPage}.applier.change",
                    args: [["persistedValues", "uiLanguage"], "en"]
                },
                // ensure the new state is English
                {
                    event: "{testPage}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.base.page.pageTester.verifyLanguageState",
                    args: ["{testPage}", "en"],
                    priority: "last:testing"
                },
                {
                    task: "{testPage}.cookieStore.get",
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The uiLanguage value should be set to: en", "en", "{arguments}.0.uiLanguage"]
                },
                {
                    "funcName": "jqUnit.assertNotUndefined",
                    "args": ["onContextChangeRequested event fired", "{testPage}.record.onContextChangeRequested"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
                }]
            },
            {
                name: "Test functions",
                expect: 4,
                sequence: [{
                    // getStoredPreferences
                    "task": "sjrk.storyTelling.base.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"],
                    "resolve": "jqUnit.assertEquals",
                    "resolveArgs": ["UIO language is correct after call to getStoredPreferences", "en", "{testPage}.uio.model.locale"]
                },
                {
                    "funcName": "jqUnit.assertTrue",
                    "args": ["onPreferencesLoaded event fired", "{testPage}.record.onPreferencesLoaded"]
                },
                // resetPreferences
                {
                    "funcName": "sjrk.storyTelling.testUtils.resetPreferences",
                    "args": ["{testPage}"]
                },
                {
                    "event": "{testPage}.events.onPreferencesReset",
                    "listener": "jqUnit.assert",
                    "args": ["onPreferencesLoaded event fired"]
                },
                {
                    "funcName": "jqUnit.assertNotUndefined",
                    "args": ["beforePreferencesReset event fired", "{testPage}.record.beforePreferencesReset"]
                },
                {
                    // reset record
                    "funcName": "fluid.set",
                    "args": ["{testPage}", ["record"], {}]
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
    sjrk.storyTelling.base.page.pageTester.verifyLanguageState = function (pageComponent, expectedLanguage) {
        jqUnit.assertEquals("The base page component's language is set to: " + expectedLanguage, expectedLanguage, fluid.get(pageComponent, ["model", "persistedValues", "uiLanguage"]));
        jqUnit.assertEquals("The UIO component's language is set to: " + expectedLanguage, expectedLanguage, fluid.get(pageComponent, ["uio", "model", "locale"]));
        jqUnit.assertEquals("The menu's templateManager component's language is set to: " + expectedLanguage, expectedLanguage, fluid.get(pageComponent, ["menu", "templateManager", "model", "locale"]));
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: "#testPage",
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
