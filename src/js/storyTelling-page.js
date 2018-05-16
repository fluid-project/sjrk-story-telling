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
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            },
            "onAllUiComponentsReady.registerEnglishButton": {
                this: "{that}.menu.dom.languageLinkEnglish",
                method: "click",
                args: [{lang: "en"}, "{that}.changeUioLanguage"]
            },
            "onAllUiComponentsReady.registerSpanishButton": {
                this: "{that}.menu.dom.languageLinkSpanish",
                method: "click",
                args: [{lang: "es"}, "{that}.changeUioLanguage"]
            }
        },
        invokers: {
            changeUioLanguage: {
                funcName: "sjrk.storyTelling.page.changeUioLanguage",
                args: [
                    "{arguments}.0.data.lang",
                    "{that}",
                    "{uio}.prefsEditorLoader.messageLoader",
                    "options.locale",
                    "{uio}.prefsEditorLoader.prefsEditor.events.onPrefsEditorRefresh"
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
                container: ".sjrkc-storyTelling-menu-links",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            },
            uio: {
                type: "fluid.uiOptions.prefsEditor.multilingualDemo",
                container: ".flc-prefsEditor-separatedPanel",
                options: {
                    // multilingualSettings: {
                    //     locale: "es",
                    //     tocHeader: "Table des matières"
                    // },
                    terms: {
                        "templatePrefix": "node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "src/messages/uio"
                    },
                    "tocTemplate": "node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
                    "ignoreForToC": {
                        "overviewPanel": ".flc-overviewPanel"
                    }
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

    // TODO: review this function, it could likely be implemented as listeners and modelListeners
    sjrk.storyTelling.page.changeUioLanguage = function (lang, pageComponent, uioMessageLoaderComponent, uioMessageLoaderLocalePath, completionEvent) {
        // Set the language in the resource loader
        fluid.set(uioMessageLoaderComponent, uioMessageLoaderLocalePath, lang);

        // If it’s not automatic when we fire refresh, then force the resource loader to get the new resources
        uioMessageLoaderComponent.resolveResources();

        // Set the Toc Header String

        // Set the language on the body

        // Fire onPrefsEditorRefresh
        completionEvent.fire();
    };

})(jQuery, fluid);
