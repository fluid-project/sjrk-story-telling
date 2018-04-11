/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // Manages all of the UI interaction with the DOM,
    // and organizes the general interaction of the tool
    fluid.defaults("sjrk.storyTelling.uiManager", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English (TODO: is there a better way?)
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-story-editor",
            storyViewer: ".sjrkc-storyTelling-story-viewer",
            menu: ".sjrkc-storyTelling-menu-links"
        },
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "{storyEditor}.events.onControlsBound",
                    onViewerReady: "{storyViewer}.events.onControlsBound"
                }
            },
            onVisibilityChanged: null
        },
        listeners: {
            // TODO: add namespaces for each event from a component?
            "{storyEditor}.events.onStorySubmitRequested": [{
                func: "{storyViewer}.templateManager.renderTemplateOnSelf",
                args: ["{storyViewer}.story.model"]
            },
            {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyEditor}.container"],
                    ["{storyViewer}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            }],
            "{storyViewer}.events.onStoryViewerPreviousRequested": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyViewer}.container"],
                    ["{storyEditor}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            },
            // TODO: determine a way for all UI's to be listened to at once
            "{storyEditor}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            },
            "{storyViewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            }
        },
        modelListeners: {
            uiLanguage: {
                funcName: "{that}.renderAllUiTemplates",
                excludeSource: "init"
            }
        },
        invokers: {
            "renderAllUiTemplates": {
                funcName: "sjrk.storyTelling.uiManager.renderAllUiTemplates",
                args: ["{that}"]
            }
        },
        components: {
            // handles text to speech requests globally for the whole site
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{uiManager}.events.onAllUiComponentsReady",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{storyEditor}.story.model.language"
                        }
                    },
                    modelRelay: {
                        ttsTextFromStory: {
                            target: "{that}.model.ttsText",
                            singleTransform: {
                                type: "fluid.transforms.stringTemplate",
                                template: "{storyEditor}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
                                terms: "{storyEditor}.story.model"
                            }
                        }
                    },
                    listeners: {
                        "{uiManager}.events.onStoryListenToRequested": {
                            func: "{that}.queueSpeech",
                            args: ["{that}.model.ttsText", true]
                        }
                    }
                }
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: "{uiManager}.options.selectors.menu",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    locale: "{uiManager}.model.uiLanguage"
                                }
                            }
                        }
                    }
                }
            },
            // the story editing context
            storyEditor: {
                type: "sjrk.storyTelling.ui.storyEditor",
                container: "{uiManager}.options.selectors.storyEditor",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    locale: "{uiManager}.model.uiLanguage"
                                }
                            }
                        }
                    }
                }
            },
            // the story view context
            // TODO: consider rolling the storyViewer context into the storyEditor
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: "{uiManager}.options.selectors.storyViewer",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    locale: "{uiManager}.model.uiLanguage"
                                }
                            }
                        },
                        story: {
                            options: {
                                model: "{storyEditor}.story.model"
                            }
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.uiManager.renderAllUiTemplates = function (component) {
        fluid.each(component.options.components, function (subcomponent) {
            if (subcomponent.type.includes("sjrk.storyTelling.ui.")) {
                // this isn't correct, yet.
                //subcomponent.options.components.templateManager.renderTemplateOnSelf();
            }
        });
    };

})(jQuery, fluid);
