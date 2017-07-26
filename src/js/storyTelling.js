/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, floe */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            onStoryTemplateAppended: null
        },
        selectors: {
            story: ".sjrkc-storyTelling-story"
        },
        listeners: {
            "onCreate.appendStoryTemplate": {
                "this": "{that}.container",
                "method": "append",
                "args": ["<div class='sjrkc-storyTelling-story'></div>"]
            },
            "onCreate.fireOnStoryTemplateAppend": {
                "func": "{that}.events.onStoryTemplateAppended.fire",
                "priority": "after:appendStoryTemplate"
            }
        },
        components: {
            story: {
                type: "sjrk.storyTelling.story",
                container: ".sjrkc-storyTelling-story",
                createOnEvent: "{storyTelling}.events.onStoryTemplateAppended"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent"
        },
        bindings: {
            storyTitle: "title",
            storyAuthor: "author",
            storyContent: "content"
        },
        model: {
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            summary: "",
            translations: []
        },
        templateTerms: {
            storyTitleIdForLabel: "@expand:{that}.getLabelId(title)",
            storyAuthorIdForLabel: "@expand:{that}.getLabelId(author)",
            storyContentIdForLabel: "@expand:{that}.getLabelId(content)",
            storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
            // TODO: classes for other links
            storyTitleClasses:
            "@expand:{that}.getClasses(storyTelling-storyTitle)",
            storyAuthorClasses:
            "@expand:{that}.getClasses(storyTelling-storyAuthor)",
            storyContentClasses:
            "@expand:{that}.getClasses(storyTelling-storyContent)",
            storySubmitClasses: "@expand:{that}.getClasses(storyTelling-submit)",

        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "src/html/story.html"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
