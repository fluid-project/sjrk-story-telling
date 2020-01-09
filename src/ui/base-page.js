/*
Copyright 2018-2020 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" // initial locale set to match the initialModel below
        },
        members: {
            initialModel: {
                // the Initial Model of the page only specifies the locale
                uiLanguage: "en" // default locale is set to English
            }
        },
        pageSetup: {
            resourcePrefix: ""
            // "authoringEnabled" is retrieved from sjrk.storyTelling.server.config.json5
            // via a request to "/clientConfig". It enables and disables the
            // authoring capabilities of the tool and must be present.
            //authoringEnabled: true
        },
        distributeOptions: {
            "ui.templateManager.authoringEnabled": {
                source: "{that}.options.pageSetup.authoringEnabled",
                target: "{that ui templateManager}.options.model.dynamicValues.authoringEnabled"
            },
            "ui.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui}.options.components.templateManager.options.templateConfig.resourcePrefix"
            },
            "ui.blockManager.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui blockManager templateManager}.options.templateConfig.resourcePrefix"
            },
            "timeBased.stopMediaPlayerOnContextChange": {
                record: { "{page}.events.onContextChangeRequested": "{that}.stopMediaPlayer" },
                target: "{that sjrk.storyTelling.blockUi.timeBased}.options.listeners"
            },
            "ui.requestResourceLoadOnRenderAllUiTemplates": {
                record: { "{sjrk.storyTelling.base.page}.events.onRenderAllUiTemplates": "{templateManager}.events.onResourceLoadRequested.fire" },
                target: "{that sjrk.storyTelling.ui}.options.listeners"
            },
            "templateManager.uiLanguageToTemplateManager": {
                record: {
                    target: "{that}.model.locale",
                    singleTransform: {
                        type: "fluid.transforms.condition",
                        condition: "{page}.model.uiLanguage",
                        true: "{page}.model.uiLanguage",
                        false: undefined
                    },
                    namespace: "uiLanguageToTemplateManager"
                },
                target: "{that sjrk.storyTelling.templateManager}.options.modelRelay"
            }
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onMenuReady: "{menu}.events.onControlsBound",
                    onUioReady: "onUioReady"
                }
            },
            onPreferencesLoaded: null,
            onPreferenceLoadFailed: null,
            onContextChangeRequested: null, // this includes changes in visibility, language, etc.
            onUioReady: null,
            onUioPanelsUpdated: null,
            onRenderAllUiTemplates: null,
            beforePreferencesReset: null,
            onPreferencesReset: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.base.page.getStoredPreferences",
                args: ["{that}", "{cookieStore}"]
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": [{
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"],
                namespace: "changeUiLanguage"
            },
            {
                func: "{that}.events.onContextChangeRequested.fire",
                namespace: "onContextChangeRequested",
                priority: "last"
            }]
        },
        modelListeners: {
            uiLanguage: {
                funcName: "{that}.events.onRenderAllUiTemplates",
                namespace: "renderAllUiTemplates"
            },
            "": {
                func: "{cookieStore}.set",
                args: [null, "{page}.model"],
                excludeSource: "init",
                namespace: "setCookie"
            }
        },
        components: {
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    gradeNames: ["fluid.dataSource.writable"],
                    cookie: {
                        name: "sjrk-st-settings",
                        path: "/",
                        expires: ""
                    }
                }
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: ".sjrkc-st-menu"
            },
            uio: {
                type: "fluid.uiOptions.prefsEditor.multilingualDemo",
                container: ".flc-prefsEditor-separatedPanel",
                options: {
                    model: {
                        locale: "{page}.model.uiLanguage"
                    },
                    listeners: {
                        "onUioReady.escalate": "{page}.events.onUioReady"
                    }
                }
            }
        }
    });

    /* Retrieves preferences stored in the cookie and applies them to the component
     * - "pageComponent": the `page` component that will accept the preferences
     * - "cookieStore": a fluid.prefs.cookieStore containing the data to laod
     */
    sjrk.storyTelling.base.page.getStoredPreferences = function (pageComponent, cookieStore) {
        var promise = cookieStore.get();

        promise.then(function (response) {
            if (response !== undefined) {
                pageComponent.applier.change("", response);
            }
            pageComponent.events.onPreferencesLoaded.fire();
        }, function (error) {
            pageComponent.events.onPreferenceLoadFailed.fire(error);
        });
    };

    /* Resets the page preferences and clears the page model, with event hooks
     * before and after the reset
     * - "pageComponent": the page component to be reset
     */
    sjrk.storyTelling.base.page.resetPreferences = function (pageComponent) {
        var transaction = pageComponent.applier.initiate();
        pageComponent.events.beforePreferencesReset.fire(pageComponent);
        transaction.fireChangeRequest({path: "", type: "DELETE"});
        transaction.change("", fluid.copy(pageComponent.initialModel));
        transaction.commit();
        // setting the cookie expiry to epoch in order to delete it
        document.cookie = pageComponent.cookieStore.options.cookie.name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        pageComponent.events.onPreferencesReset.fire(pageComponent);
    };

})(jQuery, fluid);
