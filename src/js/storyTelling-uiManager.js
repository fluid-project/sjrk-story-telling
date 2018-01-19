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
            uiLanguage: "en"
        },
        events: {
            onStoryListenToRequested: null,
            onStorySubmitRequestedFromEditor: null,
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "onEditorReady",
                    onPreviewerReady: "onPreviewerReady"
                }
            },
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
                    selectors: {
                        storyEditorPage1: ".sjrkc-storyTelling-storyEditorPage1",
                        storyEditorPage2: ".sjrkc-storyTelling-storyEditorPage2"
                    },
                    listeners: {
                        "onControlsBound.escalate": {
                            func: "{uiManager}.events.onEditorReady.fire"
                        },
                        "onEditorNextRequested.manageVisibility": {
                            funcName: "sjrk.storyTelling.uiManager.manageVisibility",
                            args: [
                                ["{that}.dom.storyEditorPage1", "{previewer}.dom.storyPreviewer"],
                                ["{that}.dom.storyEditorPage2"],
                                "{uiManager}.events.onVisibilityChanged"
                            ]
                        },
                        "onEditorPreviousRequested.manageVisibility": {
                            funcName: "sjrk.storyTelling.uiManager.manageVisibility",
                            args: [
                                ["{that}.dom.storyEditorPage2", "{previewer}.dom.storyPreviewer"],
                                ["{that}.dom.storyEditorPage1"],
                                "{uiManager}.events.onVisibilityChanged"
                            ]
                        },
                        "onStorySubmitRequested.manageVisibility": {
                            funcName: "sjrk.storyTelling.uiManager.manageVisibility",
                            args: [
                                ["{that}.dom.storyEditorPage1", "{that}.dom.storyEditorPage2"],
                                ["{previewer}.dom.storyPreviewer"],
                                "{uiManager}.events.onVisibilityChanged"
                            ]
                        },
                        "onStorySubmitRequested.escalate": {
                            func: "{uiManager}.events.onStorySubmitRequestedFromEditor.fire",
                            priority: "after:manageVisibility"
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
                    selectors: {
                        storyPreviewer: ".sjrkc-storyTelling-storyViewer"
                    },
                    listeners: {
                        "onControlsBound.escalate": {
                            func: "{uiManager}.events.onPreviewerReady.fire"
                        },
                        "onViewerPreviousRequested": {
                            funcName: "sjrk.storyTelling.uiManager.manageVisibility",
                            args: [
                                ["{editor}.dom.storyEditorPage1", "{that}.dom.storyPreviewer"],
                                ["{editor}.dom.storyEditorPage2"],
                                "{uiManager}.events.onVisibilityChanged"
                            ]
                        // },
                        // "{uiManager}.events.onStorySubmitRequestedFromEditor": {
                        //     func: "{that}.templateManager.renderTemplateOnSelf"
                        }
                    },
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
                                model: "{editor}.story.model"
                            }
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.uiManager.manageVisibility = function (hideElements, showElements, completionEvent) {
        fluid.each(hideElements, function (el) {
            el.hide();
        });

        fluid.each(showElements, function (el) {
            el.show();
        });

        completionEvent.fire();
    };

})(jQuery, fluid);
