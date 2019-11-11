/*
Copyright 2018 OCAD University
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
            uiLanguage: "en" //initial state is English
        },
        pageSetup: {
            resourcePrefix: ""
            // "authoringEnabled" is retrieved from sjrk.storyTelling.server.config.json5
            // via a request to "/clientConfig". It enables and disables the
            // authoring capabilities of the tool and must be present.
            //authoringEnabled: true
        },
        distributeOptions: [
            {
                source: "{that}.options.pageSetup.authoringEnabled",
                target: "{that ui templateManager}.options.model.dynamicValues.authoringEnabled"
            },
            {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui}.options.components.templateManager.options.templateConfig.resourcePrefix"
            },
            {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui blockManager}.options.dynamicComponents.managedViewComponents.options.components.templateManager.options.templateConfig.resourcePrefix"
            },
            {
                record: { "{page}.events.onContextChangeRequested": "{that}.stopMediaPlayer" },
                target: "{that sjrk.storyTelling.blockUi.timeBased}.options.listeners"
            },
            {
                record: { "{sjrk.storyTelling.base.page}.events.onRenderAllUiTemplates": "{templateManager}.events.onResourceLoadRequested.fire" },
                target: "{that sjrk.storyTelling.ui}.options.listeners"
            },
            {
                record: {
                    target: "{that}.model.locale",
                    singleTransform: {
                        type: "fluid.transforms.condition",
                        condition: "{page}.model.uiLanguage",
                        true: "{page}.model.uiLanguage",
                        false: undefined
                    },
                    namespace: "uiLanguage"
                },
                target: "{that sjrk.storyTelling.templateManager}.options.modelRelay"
            }
        ],
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
            onRenderAllUiTemplates: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.base.page.getStoredPreferences",
                args: ["{that}", "{cookieStore}"],
                priority: "before:reloadUioMessages"
            },
            "onCreate.reloadUioMessages": {
                func: "{that}.reloadUioMessages",
                args: ["{that}.model.uiLanguage"]
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": [{
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"],
                namespace: "changeUiLanguage"
            },
            {
                func: "{that}.reloadUioMessages",
                args: "{arguments}.0.data",
                namespace: "reloadUioMessages"
            },
            {
                func: "{that}.events.onContextChangeRequested.fire",
                namespace: "onContextChangeRequested",
                priority: "last"
            }]
        },
        invokers: {
            reloadUioMessages: {
                funcName: "sjrk.storyTelling.base.page.reloadUioMessages",
                args: [
                    "{arguments}.0",
                    "{uio}.prefsEditorLoader.messageLoader.resourceFetcher"
                ]
            }
        },
        modelListeners: {
            uiLanguage: [{
                funcName: "{that}.events.onRenderAllUiTemplates",
                namespace: "renderAllUiTemplates"
            },
            {
                funcName: "fluid.set",
                args: ["{uio}", "options.multilingualSettings.locale", "{change}.value"],
                namespace: "updateUioLanguage"
            }],
            "*": {
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
                    components: {
                        prefsEditorLoader: {
                            options: {
                                components: {
                                    prefsEditor: {
                                        options: {
                                            listeners: {
                                                "onCreate.escalate": "{page}.events.onUioReady.fire",
                                                "{messageLoader}.events.onResourcesLoaded": [{
                                                    func: "{that}.events.onPrefsEditorRefresh",
                                                    namespace: "rerenderUIO"
                                                },
                                                {
                                                    func: "{page}.events.onUioReady.fire",
                                                    namespace: "escalate"
                                                },
                                                {
                                                    funcName: "sjrk.storyTelling.base.page.updateUioPanelLanguages",
                                                    args: ["{prefsEditorLoader}", "{page}"],
                                                    priority: "before:rerenderUIO",
                                                    namespace: "updateMessageBases"
                                                }]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

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

    sjrk.storyTelling.base.page.reloadUioMessages = function (lang, resourceFetcher) {
        // Set the language in the resource loader
        resourceFetcher.options.locale = lang;
        resourceFetcher.refetchAll();
    };

    sjrk.storyTelling.base.page.updateUioPanelLanguages = function (prefsEditorLoaderComponent, pageComponent) {
        var tocHeaders = {
            "en": "Table of Contents",
            "es": "Tabla de contenido"
        };

        // Set the Toc Header String
        pageComponent.uio.options.multilingualSettings.tocHeader = tocHeaders[pageComponent.model.uiLanguage];

        // Set the language on the body

        pageComponent.events.onUioPanelsUpdated.fire();
    };

})(jQuery, fluid);
