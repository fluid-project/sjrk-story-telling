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
                args: [
                    "{that}.model.title",
                    "{that}.model.author",
                    "{that}.model.content",
                    "@expand:sjrk.storyTelling.story.getBylineTemplate({resourceLoader}.resources.componentMessages.resourceText)"
                ]
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
    // title: the title of the story
    // author: the author's name/moniker
    // content: the textual content of the story
    // bylineTemplate: the template string for the byline,
    //      the value "%storyAuthor" will be replaced by the author's name
    sjrk.storyTelling.story.getFullStoryText = function (title, author, content, bylineTemplate) {
        var byLine = "";

        if (author) {
            if (bylineTemplate) {
                byLine = bylineTemplate.replace("%storyAuthor", author);
            } else {
                byLine = " by " + author; // defaults to English
            }
        }

        //var byLine = !author ? "" : (bylineTemplate ? bylineTemplate.replace("%storyAuthor", author) : " by " + author);

        return title + " " + byLine + ". " + content; // ". " for a little pause
    };

    // messagesString: JSON string of the collection of messages for the current locale, there should be
    //      a "message_storyAuthorText" key. If not, it will return undefined
    sjrk.storyTelling.story.getBylineTemplate = function (messagesString) {
        var messages = JSON.parse(messagesString);
        return messages.message_storyAuthorText;
    };

})(jQuery, fluid);
