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

    fluid.defaults("sjrk.storyTelling.story.storyEditor", {
        gradeNames: ["sjrk.storyTelling.story", "sjrk.storyTelling.templatedComponentWithBinder"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent",
            storySubmit: ".sjrkc-storyTelling-storySubmit",
            storyTags: ".sjrkc-storyTelling-storyTags"
        },
        events: {
            onStorySubmitRequested: null,
            onControlsBound: null
        },
        listeners: {
            "onTemplateRendered.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.fireOnStorySubmitRequested"]
            },
            "onTemplateRendered.fireOnControlsBound": {
                "func": "{that}.events.onControlsBound.fire",
                "priority": "after:bindSubmitControl"
            }
        },
        invokers: {
            fireOnStorySubmitRequested: {
                "func": "{that}.events.onStorySubmitRequested.fire"
            }
        },
        bindings: {
            storyTitle: "title",
            storyAuthor: "author",
            storyContent: "content",
            storyTags: {
                selector: "storyTags",
                path: "tags",
                rules: {
                    domToModel: {
                        "" : {
                            transform: {
                                type: "sjrk.storyTelling.transforms.stringToArray",
                                inputPath: ""
                            }
                        }
                    },
                    modelToDom: {
                        "" : {
                            transform: {
                                type: "sjrk.storyTelling.transforms.arrayToString",
                                inputPath: ""
                            }
                        }
                    }
                }
            }
        },
        model: {
            templateTerms: {
                storyTitleIdForLabel: "@expand:{that}.getLabelId(title)",
                storyAuthorIdForLabel: "@expand:{that}.getLabelId(author)",
                storyContentIdForLabel: "@expand:{that}.getLabelId(content)",
                storyTagsIdForLabel: "@expand:{that}.getLabelId(tags)",
                storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
                storyAddPhotosClasses: "@expand:{that}.getClasses(storyTelling-storyAddPhotos)",
                storyAddTagsClasses: "@expand:{that}.getClasses(storyTelling-storyAddTags)",
                storyTagsClasses: "@expand:{that}.getClasses(storyTelling-storyTags)",
                storyCreateSummaryClasses: "@expand:{that}.getClasses(storyTelling-storyCreateSummary)",
                storyTranslateClasses: "@expand:{that}.getClasses(storyTelling-storyTranslate)",
                storyTitleClasses:
                "@expand:{that}.getClasses(storyTelling-storyTitle)",
                storyAuthorClasses:
                "@expand:{that}.getClasses(storyTelling-storyAuthor)",
                storyContentClasses:
                "@expand:{that}.getClasses(storyTelling-storyContent)",
                storySubmitClasses: "@expand:{that}.getClasses(storyTelling-storySubmit)"
            }
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "src/templates/storyEdit.html"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
