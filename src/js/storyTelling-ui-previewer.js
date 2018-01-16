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

    fluid.defaults("sjrk.storyTelling.ui.previewer", {
        gradeNames: ["sjrk.storyTelling.ui"],
        interfaceControlStrings: {
            storyListTagsClasses: "@expand:{that}.getClasses(storyTelling-storyListTags)",
            storyShareClasses: "@expand:{that}.getClasses(storyTelling-storyShare)",
            storySaveNoShareClasses: "@expand:{that}.getClasses(storyTelling-storySaveNoShare)",
            storyReadMoreClasses: "@expand:{that}.getClasses(storyTelling-storyReadMore)",
            storyViewerPreviousClasses: "@expand:{that}.getClasses(storyTelling-storyViewerPrevious)"
        },
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
            "onReadyToBind.bindSaveNoShareControl": {
                "this": "{that}.dom.storySaveNoShare",
                "method": "click",
                "args": ["{that}.events.onSaveNoShareRequested.fire"]
            },
            "onReadyToBind.bindViewerPreviousControl": {
                "this": "{that}.dom.storyViewerPrevious",
                "method": "click",
                "args": ["{that}.events.onViewerPreviousRequested.fire"]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyView.handlebars"
                    }
                }
            },
            story: {
                options: {
                    model: {
                        languageName: ""
                    },
                    modelRelay: {
                        target: "{that}.model.languageName",
                        forward: {
                            excludeSource: "init"
                        },
                        singleTransform: {
                            type: "sjrk.storyTelling.transforms.valueOrIndex",
                            input: "{story}.model.language",
                            component: "{templateManager}",
                            path: "options.templateStrings.availableLanguages",
                            index: "{story}.model.language"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
