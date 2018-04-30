/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.pageShell", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English (TODO: is there a better way?)
        },
        selectors: {
            menu: ".sjrkc-storyTelling-menu-links",
            learningReflectionsMasthead: ".sjrkc-learningReflections-pageHeading-container",
            learningReflectionsFooter: ".sjrkc-learningReflections-pageFooter-container"
        },
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: null,
            onContextChangeRequested: null // TODO: think of a better name
        },
        listeners: {
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            }
        },
        modelListeners: {
            uiLanguage: [
                {
                    funcName: "sjrk.storyTelling.uiManager.renderAllUiTemplates",
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
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsMasthead}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsFooter}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            // handles text to speech requests globally for the whole site
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{pageShell}.events.onAllUiComponentsReady",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{pageShell}.model.uiLanguage"
                        }
                    },
                    listeners: {
                        "{pageShell}.events.onStoryListenToRequested": {
                            func: "{that}.queueSpeech",
                            args: ["{that}.model.ttsText", true]
                        }
                    }
                }
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: "{pageShell}.options.selectors.menu",
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
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: "{pageShell}.options.selectors.learningReflectionsMasthead",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-masthead.handlebars",
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            },
            // footer section
            learningReflectionsFooter: {
                type: "sjrk.storyTelling.ui",
                container: "{pageShell}.options.selectors.learningReflectionsFooter",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-footer.handlebars",
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
