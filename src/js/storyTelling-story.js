/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */


(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.base", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
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
        model: {
            templateTerms: {
                storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
                storyTitleClasses: "@expand:{that}.getClasses(storyTelling-storyTitle)",
                storyAuthorClasses: "@expand:{that}.getClasses(storyTelling-storyAuthor)",
                storyContentClasses: "@expand:{that}.getClasses(storyTelling-storyContent)",
                storyLanguageClasses: "@expand:{that}.getClasses(storyTelling-storyLanguage)",
                storyAuthor: "{that}.model.author",
                storyTitle: "{that}.model.title",
                storyContent: "{that}.model.content"
            }
        },
        selectors: {
            storyTitle: ".sjrkc-storyTelling-storyTitle",
            storyAuthor: ".sjrkc-storyTelling-storyAuthor",
            storyContent: ".sjrkc-storyTelling-storyContent",
            storyLanguage: ".sjrkc-storyTelling-storyLanguage",
            storyTags: ".sjrkc-storyTelling-storyTags",
            storyListenTo: ".sjrkc-storyTelling-storyListenTo"
        },
        events: {
            onStoryListenToRequested: null
        },
        listeners: {
            "onTemplateRendered.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"]
            },
            "onStoryListenToRequested.speakStory": {
                func: "{storySpeaker}.queueSpeech",
                args: ["@expand:fluid.stringTemplate({that}.model.templateTerms.message_readStoryText, {that}.model.templateTerms)"]
            }
        },
        components: {
            storySpeaker: {
                type: "fluid.textToSpeech",
                options: {
                    utteranceOpts: {
                        lang: "{resourceLoader}.options.locale"
                    }
                }
            },
            resourceLoader: {
                options: {
                    resources: {
                        componentMessages: "%resourcePrefix/src/messages/storyMessages.json"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
