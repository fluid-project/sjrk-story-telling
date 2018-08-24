/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testPage", {
        gradeNames: ["sjrk.storyTelling.page"],
        events: {
            onCookieDropped: null
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
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test page grade",
            tests: [{
                name: "Test events and timing",
                expect: 23,
                sequence: [{
                    "event": "{pageTest page}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired"
                },
                {
                    "event": "{pageTest page storySpeaker}.events.onCreate",
                    "listener": "jqUnit.assert",
                    "args": "storySpeaker onCreate event fired"
                },
                // ensure the initial state is English
                {
                    func: "{page}.applier.change",
                    args: ["uiLanguage", "en"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{page}.menu.dom.languageLinkSpanish"
                },
                {
                    "event": "{page}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for Spanish button with correct args", "es", "{arguments}.0.data"]
                },
                {
                    "event": "{page}.menu.events.onControlsBound",
                    "listener": "jqUnit.assertEquals",
                    "args": ["menu re-rendered in Spanish after uiLanguage change to Spanish", "es", "{page}.menu.templateManager.model.locale"]
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for Spanish button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "es", "{page}.model.uiLanguage"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{page}.menu.dom.languageLinkEnglish"
                },
                {
                    "event": "{page}.menu.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for English button with correct args", "en", "{arguments}.0.data"]
                },
                {
                    "event": "{page}.menu.events.onControlsBound",
                    "listener": "jqUnit.assertEquals",
                    "args": ["menu re-rendered in English after uiLanguage change to English", "en", "{page}.menu.templateManager.model.locale"]
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "UIO messages reloaded successfully for English button"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["uiLanguage value is as expected", "en", "{page}.model.uiLanguage"]
                },
                {
                    func: "{page}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "event": "{page}.events.onContextChangeRequested",
                    "listener": "jqUnit.assert",
                    "args": "onContextChangeRequested fired after menu language change"
                },
                {
                    func: "{page}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"es"}]
                },
                {
                    "event": "{page}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.pageTester.verifyUioPanelLanguages",
                    "args": ["{page}", "es"]
                },
                {
                    func: "{page}.menu.events.onInterfaceLanguageChangeRequested.fire",
                    args: [{data:"en"}]
                },
                {
                    "event": "{page}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.pageTester.verifyUioPanelLanguages",
                    "args": ["{page}", "en"]
                }]
            },
            {
                name: "Test storySpeaker",
                expect: 3,
                sequence: [{
                    func: "{page}.storySpeaker.applier.change",
                    args: ["ttsText", "Shyguy is a cat"]
                },
                {
                    "changeEvent": "{page}.storySpeaker.applier.modelChanged",
                    "path": "ttsText",
                    "listener": "{page}.events.onStoryListenToRequested.fire"
                },
                {
                    "event": "{page}.storySpeaker.events.onSpeechQueued",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Speech queued with expected values", "Shyguy is a cat", "{arguments}.0"]
                },
                {
                    func: "{page}.applier.change",
                    args: ["uiLanguage", "catspeak"]
                },
                {
                    "changeEvent": "{page}.applier.modelChanged",
                    "path": "uiLanguage",
                    "listener": "jqUnit.assertEquals",
                    "args": ["storySpeaker language is as expected" ,"catspeak", "{page}.storySpeaker.model.utteranceOpts.lang"]
                },
                {
                    func: "{page}.applier.change",
                    args: ["uiLanguage", "en"]
                },
                {
                    "changeEvent": "{page}.applier.modelChanged",
                    "path": "uiLanguage",
                    "listener": "jqUnit.assertEquals",
                    "args": ["storySpeaker language is as expected" ,"en", "{page}.storySpeaker.model.utteranceOpts.lang"]
                }]
            },
            {
                name: "Test functions and invokers",
                expect: 22,
                sequence: [{
                    "funcName": "sjrk.storyTelling.page.renderAllUiTemplates",
                    "args": "{page}"
                },
                {
                    "event": "{page}.menu.events.onControlsBound",
                    "listener": "jqUnit.assert",
                    "args": "menu re-rendered after call to renderAllUiTemplates"
                },
                {
                    "funcName": "sjrk.storyTelling.page.getStoredPreferences",
                    "args": ["{page}", "{page}.cookieStore"]
                },
                {
                    "event": "{page}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO language is correct after call to getStoredPreferences", "en", "{page}.uio.options.multilingualSettings.locale"]
                },
                {
                    "funcName": "sjrk.storyTelling.page.reloadUioMessages",
                    "args": ["en", "{page}.uio.prefsEditorLoader.messageLoader", "options.locale"]
                },
                {
                    "event": "{page}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.pageTester.verifyUioPanelLanguages",
                    "args": ["{page}", "en"]
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.prefsEditor.events.onPrefsEditorRefresh",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO messages reloaded successfully", "en", "{page}.uio.prefsEditorLoader.messageLoader.options.locale"]
                },
                {
                    "funcName": "{page}.reloadUioMessages",
                    "args": ["en"]
                },
                {
                    "event": "{page}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.pageTester.verifyUioPanelLanguages",
                    "args": ["{page}", "en"]
                },
                {
                    "event": "{page}.uio.prefsEditorLoader.prefsEditor.events.onPrefsEditorRefresh",
                    "listener": "jqUnit.assertEquals",
                    "args": ["UIO messages reloaded successfully", "en", "{page}.uio.prefsEditorLoader.messageLoader.options.locale"]
                },
                {
                    "funcName": "sjrk.storyTelling.page.updateUioPanelLanguages",
                    "args": ["{page}.uio.prefsEditorLoader", "{page}"]
                },
                {
                    "event": "{page}.events.onUioPanelsUpdated",
                    "listener": "sjrk.storyTelling.pageTester.verifyUioPanelLanguages",
                    "args": ["{page}", "en"]
                }]
            },
            {
                name: "Test cookieStore",
                expect: 4,
                sequence: [{
                    "func": "{page}.applier.change",
                    "args": ["uiLanguage", "meowish"]
                },
                {
                    "event": "{page}.cookieStore.events.onWriteResponse",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Cookie was saved after uiLanguage change, cookie data is as expected", "meowish", "{arguments}.0.uiLanguage"]
                },
                {
                    "func": "{page}.applier.change",
                    "args": ["fuzzyCat", "yes please"]
                },
                {
                    "event": "{page}.cookieStore.events.onWriteResponse",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Cookie was saved after new value added, cookie data is as expected", "yes please", "{arguments}.0.fuzzyCat"]
                },
                {
                    "funcName": "sjrk.storyTelling.page.getStoredPreferences",
                    "args": ["{page}", "{page}.cookieStore"]
                },
                {
                    "event": "{page}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Language is still as expected after cookie load", "meowish", "{page}.model.uiLanguage"]
                },
                // reset the cookie to its initial state for subsequent test runs
                {
                    "funcName": "sjrk.storyTelling.pageTester.dropCookie",
                    "args": ["{page}.cookieStore.options.cookie.name", "{page}.events.onCookieDropped"]
                },
                {
                    "event": "{page}.events.onCookieDropped",
                    "listener": "sjrk.storyTelling.page.getStoredPreferences",
                    "args": ["{page}", "{page}.cookieStore"]
                },
                {
                    "event": "{page}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assertEquals",
                    "args": ["Language is still as expected after cookie load", undefined, "{page}.model"]
                }]
            }]
        }]
    });

    /* Adapted from fluid.tests.prefs.store.dropCookie
     * - "cookieName": the name of the cookie to be dropped
     * - "completionEvent": the event to be fired upon dropping
     */
    sjrk.storyTelling.pageTester.dropCookie = function (cookieName, completionEvent) {
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        completionEvent.fire();
    };

    sjrk.storyTelling.pageTester.verifyUioPanelLanguages = function (pageComponent, expectedLanguage) {
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

    fluid.defaults("sjrk.storyTelling.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            page: {
                type: "sjrk.storyTelling.testPage",
                container: "#testPage",
                createOnEvent: "{pageTester}.events.onTestCaseStart"
            },
            pageTester: {
                type: "sjrk.storyTelling.pageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.pageTest"
        ]);
    });

})(jQuery, fluid);
