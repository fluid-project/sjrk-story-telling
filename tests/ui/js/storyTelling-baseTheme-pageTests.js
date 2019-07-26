/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.baseTheme.page.testPage", {
        gradeNames: ["sjrk.storyTelling.baseTheme.page"],
        events: {
            onCookieDropped: null
        },
        pageSetup: {
            resourcePrefix: "../.."
        },
        components: {
            storySpeaker: {
                options: {
                    model: {
                        utteranceOpts: {
                            // not all speech synthesizers will respect this setting
                            volume: 0
                        }
                    }
                }
            },
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "../../messages/uio"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Test events and timing",
                expect: 24,
                sequence: [{
                    "event": "{pageTest testPage}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                {
                    "event": "{pageTest testPage storySpeaker}.events.onCreate",
                    "listener": "jqUnit.assert",
                    "args": "storySpeaker onCreate event fired"
                },
                // ensure the initial state is English
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", "en"]
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
                {
                    "event": "{testPage}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for English button"
                },
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
                    "listener": "sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "es"]
                },
                {
                    func: "{testPage}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages",
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
                }]
            },
            {
                name: "Test storySpeaker",
                expect: 3,
                sequence: [{
                    func: "{testPage}.storySpeaker.applier.change",
                    args: ["ttsText", "Shyguy is a cat"]
                },
                {
                    "changeEvent": "{testPage}.storySpeaker.applier.modelChanged",
                    "path": "ttsText",
                    "listener": "{testPage}.events.onStoryListenToRequested.fire"
                },
                {
                    "event": "{testPage}.storySpeaker.events.onSpeechQueued",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Speech queued with expected values", "Shyguy is a cat", "{arguments}.0"]
                },
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", "catspeak"]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "uiLanguage",
                    "listener": "jqUnit.assertEquals",
                    "args": ["storySpeaker language is as expected" ,"catspeak", "{testPage}.storySpeaker.model.utteranceOpts.lang"]
                },
                {
                    func: "{testPage}.applier.change",
                    args: ["uiLanguage", "en"]
                },
                {
                    "changeEvent": "{testPage}.applier.modelChanged",
                    "path": "uiLanguage",
                    "listener": "jqUnit.assertEquals",
                    "args": ["storySpeaker language is as expected" ,"en", "{testPage}.storySpeaker.model.utteranceOpts.lang"]
                }]
            },
            {
                name: "Test functions and invokers",
                expect: 22,
                sequence: [{
                    "funcName": "sjrk.storyTelling.baseTheme.page.renderAllUiTemplates",
                    "args": "{testPage}"
                },
                {
                    "event": "{testPage}.menu.events.onControlsBound",
                    "listener": "jqUnit.assert",
                    "args": "menu re-rendered after call to renderAllUiTemplates"
                },
                {
                    "funcName": "sjrk.storyTelling.baseTheme.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"]
                },
                {
                    "event": "{testPage}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO language is correct after call to getStoredPreferences", "en", "{testPage}.uio.options.multilingualSettings.locale"]
                },
                {
                    "funcName": "sjrk.storyTelling.baseTheme.page.reloadUioMessages",
                    "args": ["en", "{testPage}.uio.prefsEditorLoader.messageLoader", "options.locale"]
                },
                {
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "en"]
                },
                {
                    "event": "{testPage}.uio.prefsEditorLoader.prefsEditor.events.onPrefsEditorRefresh",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO messages reloaded successfully", "en", "{testPage}.uio.prefsEditorLoader.messageLoader.options.locale"]
                },
                {
                    "funcName": "{testPage}.reloadUioMessages",
                    "args": ["en"]
                },
                {
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "en"]
                },
                {
                    "event": "{testPage}.uio.prefsEditorLoader.prefsEditor.events.onPrefsEditorRefresh",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO messages reloaded successfully", "en", "{testPage}.uio.prefsEditorLoader.messageLoader.options.locale"]
                },
                {
                    "funcName": "sjrk.storyTelling.baseTheme.page.updateUioPanelLanguages",
                    "args": ["{testPage}.uio.prefsEditorLoader", "{testPage}"]
                },
                {
                    "event": "{testPage}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages",
                    "args": ["{testPage}", "en"]
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
                    "funcName": "sjrk.storyTelling.baseTheme.page.getStoredPreferences",
                    "args": ["{testPage}", "{testPage}.cookieStore"]
                },
                {
                    "event": "{testPage}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Language is still as expected after cookie load", "meowish", "{testPage}.model.uiLanguage"]
                },
                // reset the cookie to its initial state for subsequent test runs
                {
                    "funcName": "sjrk.storyTelling.baseTheme.page.pageTester.dropCookie",
                    "args": ["{testPage}.cookieStore.options.cookie.name", "{testPage}.events.onCookieDropped"]
                },
                {
                    "event": "{testPage}.events.onCookieDropped",
                    "listener": "sjrk.storyTelling.baseTheme.page.getStoredPreferences",
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
    sjrk.storyTelling.baseTheme.page.pageTester.dropCookie = function (cookieName, completionEvent) {
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        completionEvent.fire();
    };

    sjrk.storyTelling.baseTheme.page.pageTester.verifyUioPanelLanguages = function (pageComponent, expectedLanguage) {
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            testPage: {
                type: "sjrk.storyTelling.baseTheme.page.testPage",
                container: "#testPage",
                createOnEvent: "{pageTester}.events.onTestCaseStart"
            },
            pageTester: {
                type: "sjrk.storyTelling.baseTheme.page.pageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.baseTheme.page.pageTest"
        ]);
    });

})(jQuery, fluid);
