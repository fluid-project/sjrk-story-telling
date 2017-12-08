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

    fluid.defaults("sjrk.storyTelling.story.storyViewer", {
        gradeNames: ["sjrk.storyTelling.story.ui"],
        selectors: {
            storySaveNoShare: ".sjrkc-storyTelling-storySaveNoShare",
            storyTags: ".sjrkc-storyTelling-storyListTags",
            storyViewerPrevious: ".sjrkc-storyTelling-storyViewerPrevious"
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
            languageName: ""
        },
        // TODO: this block will be removed at some point, and values hardcoded in the template(s)
        interfaceControlStrings: {
            storyListTagsClasses: "@expand:{that}.getClasses(storyTelling-storyListTags)",
            storyShareClasses: "@expand:{that}.getClasses(storyTelling-storyShare)",
            storySaveNoShareClasses: "@expand:{that}.getClasses(storyTelling-storySaveNoShare)",
            storyReadMoreClasses: "@expand:{that}.getClasses(storyTelling-storyReadMore)",
            storyViewerPreviousClasses: "@expand:{that}.getClasses(storyTelling-storyViewerPrevious)"
        },
        modelRelay: {
            target: "{that}.model.languageName",
            forward: {
                excludeSource: "init"
            },
            singleTransform: {
                type: "fluid.transforms.free",
                func: "sjrk.storyTelling.story.getValueOrFallback",
                args: ["{that}.options.interfaceLocalizationStrings.availableLanguages", "{that}.model.language"]
            }
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyView.handlebars"
                    }
                }
            }
        }
    });

    // returns the value of an array at a given index, or, failing that, the index itself
    sjrk.storyTelling.story.getValueOrFallback = function (array, index) {
        return array[index] || index;
    };

})(jQuery, fluid);
