/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.page", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English
        },
        pageSetup: {
            resourcePrefix: "",
            savingEnabled: true // should match the setting in sjrk.storyTelling.server.server.globalConfig
        },
        distributeOptions: [
            {
                source: "{that}.options.pageSetup.savingEnabled",
                target: "{that ui}.options.model.savingEnabled"
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
                record: {
                    "{page}.events.onContextChangeRequested": "{that}.stopMediaPlayer"
                },
                target: "{that sjrk.storyTelling.blockUi.timeBased}.options.listeners"
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
            onStoryListenToRequested: null,
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
            onUioPanelsUpdated: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.page.getStoredPreferences",
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
                funcName: "sjrk.storyTelling.page.reloadUioMessages",
                args: [
                    "{arguments}.0",
                    "{uio}.prefsEditorLoader.messageLoader",
                    "options.locale"
                ]
            }
        },
        modelListeners: {
            uiLanguage: [{
                funcName: "sjrk.storyTelling.page.renderAllUiTemplates",
                args: ["{that}"],
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
            // handles text to speech requests globally for the whole site
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{page}.events.onAllUiComponentsReady",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{page}.model.uiLanguage"
                        }
                    },
                    listeners: {
                        "{page}.events.onStoryListenToRequested": {
                            func: "{that}.queueSpeech",
                            args: ["{that}.model.ttsText", true],
                            namespace: "queueSpeech"
                        }
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
                                                    funcName: "sjrk.storyTelling.page.updateUioPanelLanguages",
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

    sjrk.storyTelling.page.renderAllUiTemplates = function (component) {
        fluid.each(component, function (subcomponent) {
            if (subcomponent &&
                subcomponent.options &&
                subcomponent.options.gradeNames &&
                subcomponent.options.gradeNames.includes("sjrk.storyTelling.ui")) {
                subcomponent.templateManager.events.onResourceLoadRequested.fire();
            }
        });
    };

    sjrk.storyTelling.page.getStoredPreferences = function (pageComponent, cookieStore) {
        var promise = cookieStore.get();

        promise.then(function (response) {
            pageComponent.applier.change("", response);
            pageComponent.events.onPreferencesLoaded.fire();
        }, function (error) {
            pageComponent.events.onPreferenceLoadFailed.fire(error);
        });
    };

    sjrk.storyTelling.page.reloadUioMessages = function (lang, uioMessageLoaderComponent, uioMessageLoaderLocalePath) {
        // Set the language in the resource loader
        fluid.set(uioMessageLoaderComponent, uioMessageLoaderLocalePath, lang);

        // Force the resource loader to get the new resources
        fluid.resourceLoader.loadResources(uioMessageLoaderComponent, uioMessageLoaderComponent.resolveResources());
    };

    sjrk.storyTelling.page.updateUioPanelLanguages = function (prefsEditorLoaderComponent, pageComponent) {
        if (prefsEditorLoaderComponent && prefsEditorLoaderComponent.prefsEditor) {
            fluid.each(prefsEditorLoaderComponent.prefsEditor, function (panel, key) {
                if (key.startsWith("fluid_prefs_panel_")) {
                    if (panel.msgResolver) {
                        // language is stored in order to be verifiable
                        panel.msgResolver.messageLanguage = pageComponent.model.uiLanguage;
                        panel.msgResolver.messageBase = prefsEditorLoaderComponent.messageLoader.resources[key].resourceText;
                    }
                }
            });
        }

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
