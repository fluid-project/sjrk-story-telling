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
        uiConfig: {
            uiLanguage: "en"
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor",
            storyPreviewer: ".sjrkc-storyTelling-storyPreviewer"
        },
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "{editor}.events.onControlsBound",
                    onPreviewerReady: "{previewer}.events.onControlsBound"
                }
            },
            onVisibilityChanged: null
        },
        listeners: {
            "{editor}.events.onStorySubmitRequested": [{
                func: "{previewer}.templateManager.renderTemplateOnSelf",
                args: ["{previewer}.story.model"]
            },
            {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{editor}.container"],
                    ["{previewer}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            }],
            "{previewer}.events.onPreviewerPreviousRequested": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{previewer}.container"],
                    ["{editor}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            }
        },
        components: {
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{uiManager}.events.onAllUiComponentsReady",
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
                                template: "{editor}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
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
                container: "{uiManager}.options.selectors.storyEditor",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    locale: "{uiManager}.options.uiConfig.uiLanguage"
                                }
                            }
                        }
                    }
                }
            },
            // TODO: consider rolling the previewer context into the editor
            previewer: {
                type: "sjrk.storyTelling.ui.previewer",
                container: "{uiManager}.options.selectors.storyPreviewer",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    locale: "{uiManager}.options.uiConfig.uiLanguage"
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

})(jQuery, fluid);
