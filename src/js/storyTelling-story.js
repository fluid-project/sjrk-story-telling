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

    fluid.defaults("sjrk.storyTelling.story.base", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            // TODO: add an ID field?
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            categories: [],
            summary: "",
            requestedTranslations: [
                //"es": 2, // a list of language codes as keys with
                //"fr": 5  // the number of requests for that language
            ],
            translationOf: null
        }
    });

    // mixin grade which combines the base story with a templatedComponentWithLocalization
    // contains common elements for all of the story interface contexts (editor, viewer, etc.)
    fluid.defaults("sjrk.storyTelling.story.ui", {
        gradeNames: ["sjrk.storyTelling.story.base", "sjrk.storyTelling.templatedComponentWithLocalization"],
        // TODO: this block will be removed at some point, and values hardcoded in the template(s)
        interfaceControlStrings: {
            storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
            storyTitleClasses: "@expand:{that}.getClasses(storyTelling-storyTitle)",
            storyAuthorClasses: "@expand:{that}.getClasses(storyTelling-storyAuthor)",
            storyContentClasses: "@expand:{that}.getClasses(storyTelling-storyContent)",
            storySummaryClasses: "@expand:{that}.getClasses(storyTelling-storySummary)",
            storyLanguageClasses: "@expand:{that}.getClasses(storyTelling-storyLanguage)",
            storyCategoryClasses: "@expand:{that}.getClasses(storyTelling-storyCategories)"
        },
        interfaceLocalizationStrings: {},
        selectors: {
            storyTitle: ".sjrkc-storyTelling-storyTitle",
            storyAuthor: ".sjrkc-storyTelling-storyAuthor",
            storyContent: ".sjrkc-storyTelling-storyContent",
            storySummary: ".sjrkc-storyTelling-storySummary",
            storyLanguage: ".sjrkc-storyTelling-storyLanguage",
            storyTags: ".sjrkc-storyTelling-storyTags",
            storyListenTo: ".sjrkc-storyTelling-storyListenTo",
            storyCategories: ".sjrkc-storyTelling-storyCategories"
        },
        events: {
            onStoryListenToRequested: null
        },
        listeners: {
            "onTemplateRendered.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"]
            }
        },
        components: {
            storySpeaker: {
                type: "sjrk.storyTelling.story.storySpeaker",
                createOnEvent: "{ui}.events.onAllResourcesLoaded"
            },
            messageLoader: {
                options: {
                    resources: {
                        componentMessages: "%resourcePrefix/src/messages/storyMessages.json"
                    }
                }
            }
        }
    });

    // Mixin grade to be used with sjrk.storyTelling.story.ui, provides a text-to-speech
    // interface that reads dynamic text out and based on the story ui's model values
    fluid.defaults("sjrk.storyTelling.story.storySpeaker", {
        gradeNames: "fluid.textToSpeech",
        model:{
            ttsText: null,
            utteranceOpts: {
                lang: "{ui}.model.language"
            }
        },
        modelRelay: {
            target: "{that}.model.ttsText",
            singleTransform: {
                type: "fluid.transforms.stringTemplate",
                template: "{ui}.options.interfaceLocalizationStrings.message_readStoryText",
                terms: "{ui}.model"
            }
        },
        listeners: {
            "{ui}.events.onStoryListenToRequested": {
                func: "{that}.queueSpeech",
                args: ["{that}.model.ttsText", true]
            }
        }
    });

})(jQuery, fluid);
