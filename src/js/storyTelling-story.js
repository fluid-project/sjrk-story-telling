/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk */


(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            summary: "",
            translationOf: null,
            templateTerms: {
                storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
                storyTitleClasses: "@expand:{that}.getClasses(storyTelling-storyTitle)",
                storyAuthorClasses: "@expand:{that}.getClasses(storyTelling-storyAuthor)",
                storyContentClasses: "@expand:{that}.getClasses(storyTelling-storyContent)",
                storyLanguageClasses: "@expand:{that}.getClasses(storyTelling-storyLanguage)"
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
        invokers: {
            getFullStoryText: {
                "funcName": "sjrk.storyTelling.story.getFullStoryText",
                args: ["{that}.model.title", "{that}.model.author", "{that}.model.content", "{resourceLoader}"]
            }
        }
    });

    // Component to provide text to speech capability to various uses of
    // story
    fluid.defaults("sjrk.storyTelling.story.storySpeaker", {
        gradeNames: ["fluid.textToSpeech"],
        model: {
            utteranceOpts: {
                // Expected to be received from the resourceLoader of a templated component, such as StoryView or StoryEditor
                lang: "{resourceLoader}.options.locale"
            }
        },
        listeners: {
            // Component is expected to fire this event
            "{story}.events.onStoryListenToRequested":
            {
                func: "{that}.queueSpeech",
                args: ["@expand:{story}.getFullStoryText()"]
            }
        }
    });

    // Generates full story text, including the title, author name and story content.
    sjrk.storyTelling.story.getFullStoryText = function (title, author, content, resourceLoader) {
        var locale = resourceLoader.options.locale;

        //TODO: get proper byline message from the template messages for this locale
        //var byLineMessage =resourceLoader.resolveResources(....);
        //var byLine = byLineMessage.replace("%storyAuthor", author);
        var byLine = (locale === "en" ? ", by " : ", par ") + author;

        return title + byLine + ". " + content;
    };

})(jQuery, fluid);
