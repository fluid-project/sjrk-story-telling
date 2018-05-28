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
            uiLanguage: "en" //initial state is English (TODO: is there a better way?)
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
            }
        ],
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: {
                events: {
                    onMenuReady: "{menu}.events.onControlsBound"
                }
            },
            onContextChangeRequested: null // TODO: think of a better name
        },
        listeners: {
            "onCreate.getUiLanguage": {
                funcName: "sjrk.storyTelling.page.getUiLanguage",
                args: ["{that}", "uiLanguage", "{cookieStore}"]
            },
            "onCreate.reloadUioMessages": {
                func: "{that}.reloadUioMessages",
                args: [{data:"{that}.model.uiLanguage"}]
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            },
            "onAllUiComponentsReady.registerEnglishButton": {
                this: "{that}.menu.dom.languageLinkEnglish",
                method: "click",
                args: ["en", "{that}.reloadUioMessages"]
            },
            "onAllUiComponentsReady.registerSpanishButton": {
                this: "{that}.menu.dom.languageLinkSpanish",
                method: "click",
                args: ["es", "{that}.reloadUioMessages"]
            }
        },
        invokers: {
            reloadUioMessages: {
                funcName: "sjrk.storyTelling.page.reloadUioMessages",
                args: [
                    "{arguments}.0.data",
                    "{uio}.prefsEditorLoader.messageLoader",
                    "options.locale"
                ]
            }
        },
        modelListeners: {
            uiLanguage: [
                {
                    funcName: "sjrk.storyTelling.page.renderAllUiTemplates",
                    args: ["{that}"]
                },
                {
                    funcName: "{that}.events.onContextChangeRequested.fire"
                },
                {
                    func: "{cookieStore}.set",
                    args: [null, "{page}.model"],
                    excludeSource: "init"
                }
            ]
        },
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{menu}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
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
                            args: ["{that}.model.ttsText", true]
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
            if (subcomponent && subcomponent.typeName && subcomponent.typeName.includes("sjrk.storyTelling.ui")) {
                subcomponent.templateManager.events.onResourceLoadRequested.fire();
            }
        });
    };

    sjrk.storyTelling.page.getUiLanguage = function (pageComponent, modelPath, cookieStore) {
        var result = cookieStore.get();
        var language = fluid.get(result, "value." + modelPath);

        if (language) {
            pageComponent.applier.change(modelPath, language);
            fluid.set(pageComponent, "uio.options.multilingualSettings.locale", language);
        }
    };

    sjrk.storyTelling.page.reloadUioMessages = function (lang, uioMessageLoaderComponent, uioMessageLoaderLocalePath) {
        // Set the language in the resource loader
        fluid.set(uioMessageLoaderComponent, uioMessageLoaderLocalePath, lang);

        // If it’s not automatic when we fire refresh, then force the resource loader to get the new resources
        fluid.resourceLoader.loadResources(uioMessageLoaderComponent, uioMessageLoaderComponent.resolveResources());
    };

    // TODO: review this function, it could likely be implemented as listeners and modelListeners
    sjrk.storyTelling.page.updateMessageBases = function (prefsEditorLoaderComponent, pageComponent) {
        var panels = [
            "fluid_prefs_panel_contrast",
            "fluid_prefs_panel_enhanceInputs",
            "fluid_prefs_panel_layoutControls",
            "fluid_prefs_panel_lineSpace",
            "fluid_prefs_panel_textFont",
            "fluid_prefs_panel_textSize"
        ];

        fluid.each(panels, function (panel) {
            var panelComponent = prefsEditorLoaderComponent.prefsEditor[panel];
            panelComponent.msgResolver.messageBase = prefsEditorLoaderComponent.messageLoader.resources[panel].resourceText;
        });

        var lang = pageComponent.model.uiLanguage;

        var tocHeaders = {
            "en": "Table of Contents",
            "es": "Tabla de contenido"
        };

        // Set the Toc Header String
        pageComponent.uio.options.multilingualSettings.tocHeader = tocHeaders[lang];

        // Set the language on the body
    };

})(jQuery, fluid);
