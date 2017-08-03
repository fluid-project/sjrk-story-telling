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

    fluid.defaults("sjrk.storyTelling.story.storyViewer", {
        gradeNames: ["sjrk.storyTelling.story", "sjrk.storyTelling.templatedComponentWithLocalization"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent",
            storyTags: ".sjrkc-storyTelling-storyListTags"
        },
        modelRelay: {
            source: "tags",
            target: "templateTerms.storyTags",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString"
            }
        },
        model: {
            templateTerms: {
                // TODO: fix syntax of this
                storyTitle: "{that}.model.title",
                storyContent: "{that}.model.content",
                storyAuthor: "{that}.model.author",
                // storyTags: {},
                storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
                storyListTagsClasses: "@expand:{that}.getClasses(storyTelling-storyListTags)",
                storyTitleClasses:
                "@expand:{that}.getClasses(storyTelling-storyTitle)",
                storyAuthorClasses:
                "@expand:{that}.getClasses(storyTelling-storyAuthor)",
                storyContentClasses:
                "@expand:{that}.getClasses(storyTelling-storyContent)",
                storyShareClasses:
                "@expand:{that}.getClasses(storyTelling-storyShare)",
                storySaveNoShareClasses:
                "@expand:{that}.getClasses(storyTelling-storySaveNoShare)",
                storyReadMoreClasses:
                "@expand:{that}.getClasses(storyTelling-storyReadMore)"
            }
        },
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "src/templates/storyView.html",
                        componentMessages: "src/messages/storyView.json"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
