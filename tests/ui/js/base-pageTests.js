/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testPage", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        events: {
            onCookieDropped: null
        },
        pageSetup: {
            resourcePrefix: "../.."
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "../../node_modules/infusion/src/framework/preferences/messages"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
                    "tocMessage": "../../node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json"
                }
            },
            menu: {
                container: "#testMenu"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.base.page.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Test events and timing",
                expect: 25,
                sequence: [{
                    "event": "{pageTest testPage}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                // ensure the initial state is English
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", ""]
                },
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", "en"]
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
                // TODO: TESTS ARE HANGING HERE
                // {
                //     "event": "{testPage}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                //     "listener": "jqUnit.assert",
                //     "args": "UIO messages reloaded successfully for Spanish button"
                // },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "es", "{testPage}.model.uiLanguage"]
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
                // TODO: TESTS ARE HANGING HERE
                // {
                //     "event": "{testPage}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                //     "listener": "jqUnit.assert",
                //     "args": "UIO messages reloaded successfully for English button"
                // },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "en", "{testPage}.model.uiLanguage"]
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
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.base.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "es"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.base.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "en"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"cattish"}]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"cattish", "{testPage}.model.uiLanguage"]
                },
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", "en"]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "uiLanguage",
                    "funcName": "jqUnit.assertEquals",
                    "args": ["uiLanguage is as expected" ,"en", "{testPage}.model.uiLanguage"]
                }]
            },
            {
                name: "Test functions and invokers",
                expect: 21,
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
                expect: 4,
                sequence: [{
                    "func": "{testPage}.applier.change",
                    "args": ["uiLanguage", "meowish"]
                },
                {
                    "event": "{testPage}.cookieStore.events.onWriteResponse",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Cookie was saved after uiLanguage change, cookie data is as expected", "meowish", "{arguments}.0.uiLanguage"]
                },
                {
                    "func": "{testPage}.applier.change",
                    "args": ["fuzzyCat", "yes please"]
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
                    "args": ["Language is still as expected after cookie load", "meowish", "{testPage}.model.uiLanguage"]
                },
                // reset the cookie to its initial state for subsequent test runs
                {
                    "funcName": "sjrk.storyTelling.base.page.pageTester.dropCookie",
                    "args": ["{testPage}.cookieStore.options.cookie.name", "{testPage}.events.onCookieDropped"]
                },
                {
                    "event": "{testPage}.events.onCookieDropped",
                    "listener": "sjrk.storyTelling.base.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"]
                },
                {
                    "event": "{testPage}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Language is still as expected after cookie load", undefined, "{testPage}.model"]
                }]
            }]
        }]
    });

    /* Adapted from fluid.tests.prefs.store.dropCookie
     * - "cookieName": the name of the cookie to be dropped
     * - "completionEvent": the event to be fired upon dropping
     */
    sjrk.storyTelling.base.page.pageTester.dropCookie = function (cookieName, completionEvent) {
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        completionEvent.fire();
    };

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
