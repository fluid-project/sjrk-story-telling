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
        gradeNames: ["sjrk.storyTelling.story.ui"],
        selectors: {
            storySaveNoShare: ".sjrkc-storyTelling-storySaveNoShare",
            storyTags: ".sjrkc-storyTelling-storyListTags",
            storyViewerPrevious: ".sjrkc-storyTelling-storyViewerPrevious"
        },
        modelRelay: {
            source: "tags",
            target: "templateTerms.storyTags",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString"
            }
        },
        events: {
            onSaveNoShareRequested: null,
            onViewerPreviousRequested: null
        },
        listeners: {
            "onTemplateRendered.bindSaveNoShareControl": {
                "this": "{that}.dom.storySaveNoShare",
                "method": "click",
                "args": ["{that}.events.onSaveNoShareRequested.fire"]
            },
            "onTemplateRendered.bindViewerPreviousControl": {
                "this": "{that}.dom.storyViewerPrevious",
                "method": "click",
                "args": ["{that}.events.onViewerPreviousRequested.fire"]
            }
        },
        model: {
            templateTerms: {
                storyTitle: "{that}.model.title",
                storyContent: "{that}.model.content",
                storyAuthor: "{that}.model.author",
                storyLanguage: "{that}.model.language",
                storyListTagsClasses: "@expand:{that}.getClasses(storyTelling-storyListTags)",
                storyShareClasses: "@expand:{that}.getClasses(storyTelling-storyShare)",
                storySaveNoShareClasses: "@expand:{that}.getClasses(storyTelling-storySaveNoShare)",
                storyReadMoreClasses: "@expand:{that}.getClasses(storyTelling-storyReadMore)",
                storyViewerPreviousClasses: "@expand:{that}.getClasses(storyTelling-storyViewerPrevious)"
            }
        },
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyView.html"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
