/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // Manages all of the UI interaction with the DOM,
    // and organizes the general interaction of the tool
    fluid.defaults("sjrk.storyTelling.uiManager", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en"
        },
        events: {
            onStoryListenToRequested: null,
            onStorySubmitRequestedFromEditorNoView: null,
            onStorySubmitRequestedFromEditorViewExists: null,
            onEditorReady: null,
            onPreviewerReady: null,
            onVisibilityChanged: null
        },
        components: {
            storySpeaker: {
                type: "fluid.textToSpeech",
                // TODO: develop a way to generalize for all ui's? {ui} fails
                createOnEvent: "{editor}.events.onReadyToBind",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{editor}.story.model.language"
                        }
                    },
                    modelRelay: {
                        ttsTextFromStory: {
                            // TODO: figure out how to handle this and share it properly
                            // which instance of ui should be referenced?
                            target: "{that}.model.ttsText",
                            singleTransform: {
                                type: "fluid.transforms.stringTemplate",
                                template: "{editor}.templateManager.options.templateStrings.message_readStoryText",
                                terms: "{editor}.story.model"
                            }
                        }
                    },
                    listeners: {
                        // try using event bubbling/boiling
                        "{uiManager}.events.onStoryListenToRequested": {
                            func: "{that}.queueSpeech",
                            args: ["{that}.model.ttsText", true]
                        }
                    }
                }
            },
            editor: {
                type: "sjrk.storyTelling.ui.editor",
                // TODO: Add proper container selector
                // container: "#testEditor",
                options: {
                    listeners: {
                        "onControlsBound.escalate": {
                            func: "{uiManager}.events.onEditorReady.fire"
                        }
                    },
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
            // TODO: consider rolling the previewer context into the editor
            previewer: {
                type: "sjrk.storyTelling.ui.previewer",
                // TODO: Add proper container selector
                // container: "#testEditor",
                options: {
                    listeners: {
                        "onControlsBound.escalate": {
                            func: "{uiManager}.events.onPreviewerReady.fire"
                        }
                    },
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
            }
        }
    });

})(jQuery, fluid);
