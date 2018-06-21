/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.page", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English
        },
        pageSetup: {
            resourcePrefix: "../.."
        },
        distributeOptions: [
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
                    source: "{page}.model.uiLanguage",
                    target: "{that}.model.locale",
                    singleTransform: {
                        type: "fluid.transforms.identity"
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
                    onMenuReady: "{menu}.events.onControlsBound"
                }
            },
            onPreferencesLoaded: null,
            onContextChangeRequested: null, // this includes changes in visibility, language, etc.
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
            uiLanguage: {
                funcName: "sjrk.storyTelling.page.renderAllUiTemplates",
                args: ["{that}"]
            },
            "*": {
                func: "{cookieStore}.set",
                args: [null, "{page}.model"],
                excludeSource: "init"
            }
        },
        components: {
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    gradeNames: ["fluid.dataSource.writable"],
                    cookie: {
                        name: "sjrk-storyTelling-settings",
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
                container: ".sjrkc-storyTelling-menu-links"
            },
            uio: {
                type: "fluid.uiOptions.prefsEditor.multilingualDemo",
                container: ".flc-prefsEditor-separatedPanel",
                options: {
                    terms: {
                        "templatePrefix": "node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "src/messages/uio"
                    },
                    "tocTemplate": "node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
                    "ignoreForToC": {
                        "overviewPanel": ".flc-overviewPanel"
                    },
                    distributeOptions: [{
                        record: {
                            "{messageLoader}.events.onResourcesLoaded": [{
                                func: "{that}.events.onPrefsEditorRefresh",
                                namespace: "rerenderUIO"
                            },
                            {
                                funcName: "sjrk.storyTelling.page.updateMessageBases",
                                args: ["{prefsEditorLoader}", "{page}"],
                                priority: "before:rerenderUIO",
                                namespace: "updateMessageBases"
                            }]
                        },
                        target: "{that fluid.prefs.prefsEditor}.options.listeners"
                    }]
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
        var result = cookieStore.get();
        var preferences = fluid.get(result, "value");

        if (preferences) {
            pageComponent.applier.change("", preferences);
            fluid.set(pageComponent, "uio.options.multilingualSettings.locale", preferences.uiLanguage);
        }

        pageComponent.events.onPreferencesLoaded.fire();
    };

    sjrk.storyTelling.page.reloadUioMessages = function (lang, uioMessageLoaderComponent, uioMessageLoaderLocalePath) {
        // Set the language in the resource loader
        fluid.set(uioMessageLoaderComponent, uioMessageLoaderLocalePath, lang);

        // Force the resource loader to get the new resources
        fluid.resourceLoader.loadResources(uioMessageLoaderComponent, uioMessageLoaderComponent.resolveResources());
    };

    sjrk.storyTelling.page.updateMessageBases = function (prefsEditorLoaderComponent, pageComponent) {
        if (prefsEditorLoaderComponent && prefsEditorLoaderComponent.prefsEditor) {
            fluid.each(prefsEditorLoaderComponent.prefsEditor, function (panel, key) {
                if (key.startsWith("fluid_prefs_panel_")) {
                    if (panel.msgResolver) {
                        panel.msgResolver.messageBase = prefsEditorLoaderComponent.messageLoader.resources[key].resourceText;
                    }
                }
            });
        }

        var lang = pageComponent.model.uiLanguage;

        var tocHeaders = {
            "en": "Table of Contents",
            "es": "Tabla de contenido"
        };

        // Set the Toc Header String
        pageComponent.uio.options.multilingualSettings.tocHeader = tocHeaders[lang];

        // Set the language on the body


        pageComponent.events.onUioPanelsUpdated.fire();
    };

})(jQuery, fluid);
