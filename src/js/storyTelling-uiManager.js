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
            menu: ".sjrkc-storyTelling-menu-links",
            storyEditor: ".sjrkc-storyTelling-story-editor",
            storyPreviewer: ".sjrkc-storyTelling-story-previewer"
        },
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "{storyEditor}.events.onControlsBound",
                    onPreviewerReady: "{storyPreviewer}.events.onControlsBound"
                }
            },
            onContextChangeRequested: null, // TODO: think of a better name
            onVisibilityChanged: null
        },
        listeners: {
            "onContextChangeRequested.updateStoryFromBlocks": {
                func: "{storyEditor}.events.onUpdateStoryFromBlocksRequested.fire",
                priority: "first"
            },
            // TODO: add namespaces for each event from a component?
            "{storyEditor}.events.onStorySubmitRequested": [{
                func: "{storyPreviewer}.templateManager.renderTemplateOnSelf",
                args: ["{storyPreviewer}.story.model"]
            },
            {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyEditor}.container"],
                    ["{storyPreviewer}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            }],
            "{storyPreviewer}.events.onStoryViewerPreviousRequested": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyPreviewer}.container"],
                    ["{storyEditor}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            },
            // TODO: determine a way for all UI's to be listened to at once
            "{storyEditor}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            },
            "{storyPreviewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            }
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
                target: "{storyEditor}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{storyPreviewer}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            // handles text to speech requests globally for the whole site
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{uiManager}.events.onAllUiComponentsReady",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{uiManager}.model.uiLanguage"
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
                container: "{uiManager}.options.selectors.menu"
            },
            // the story editing context
            storyEditor: {
                type: "sjrk.storyTelling.ui.storyEditor",
                container: "{uiManager}.options.selectors.storyEditor",
                options: {
                    listeners: {
                        // TODO: determine if there is a better way to "register" these
                        onStorySubmitRequested: "{uiManager}.events.onContextChangeRequested.fire",
                        onEditorNextRequested: "{uiManager}.events.onContextChangeRequested.fire",
                        onEditorPreviousRequested: "{uiManager}.events.onContextChangeRequested.fire"
                    }
                }
            },
            // the story view context
            // TODO: consider rolling the storyViewer context into the storyEditor
            storyPreviewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: "{uiManager}.options.selectors.storyPreviewer",
                options: {
                    listeners: {
                        onStoryViewerPreviousRequested: "{uiManager}.events.onContextChangeRequested.fire"
                    },
                    components: {
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

})(jQuery, fluid);
