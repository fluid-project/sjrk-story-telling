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

    fluid.defaults("sjrk.storyTelling.story.storyEditor", {
        gradeNames: ["sjrk.storyTelling.story", "sjrk.storyTelling.templatedComponentWithLocalization", "sjrk.storyTelling.templatedComponentWithBinder"],
        selectors: {
            storySubmit: ".sjrkc-storyTelling-storySubmit",
            storyEditorNext: ".sjrkc-storyTelling-storyEditorNext",
            storyEditorPrevious: ".sjrkc-storyTelling-storyEditorPrevious"
        },
        events: {
            onStorySubmitRequested: null,
            onStoryListenToRequested: null,
            onControlsBound: null,
            onEditorNextRequested: null,
            onEditorPreviousRequested: null
        },
        listeners: {
            "onTemplateRendered.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.events.onStorySubmitRequested.fire"]
            },
            "onTemplateRendered.bindEditorNextControl": {
                "this": "{that}.dom.storyEditorNext",
                "method": "click",
                "args": ["{that}.events.onEditorNextRequested.fire"],
                "priority": "after:bindSubmitControl"
            },
            "onTemplateRendered.bindEditorPreviousControl": {
                "this": "{that}.dom.storyEditorPrevious",
                "method": "click",
                "args": ["{that}.events.onEditorPreviousRequested.fire"],
                "priority": "after:bindEditorNextControl"
            },
            "onTemplateRendered.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"],
                "priority": "after:bindEditorPreviousControl"
            },
            "onTemplateRendered.fireOnControlsBound": {
                "func": "{that}.events.onControlsBound.fire",
                "priority": "last"
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
            storyLanguage: "language",
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
                storyLanguageIdForLabel: "@expand:{that}.getLabelId(language)",
                storyTagsIdForLabel: "@expand:{that}.getLabelId(tags)",
                storyAddImagesClasses: "@expand:{that}.getClasses(storyTelling-storyAddImages)",
                storyAddTagsClasses: "@expand:{that}.getClasses(storyTelling-storyAddTags)",
                storyTagsClasses: "@expand:{that}.getClasses(storyTelling-storyTags)",
                storyCreateSummaryClasses: "@expand:{that}.getClasses(storyTelling-storyCreateSummary)",
                storyTranslateClasses: "@expand:{that}.getClasses(storyTelling-storyTranslate)",
                storySubmitClasses: "@expand:{that}.getClasses(storyTelling-storySubmit)",
                storyEditorNextClasses: "@expand:{that}.getClasses(storyTelling-storyEditorNext)",
                storyEditorPreviousClasses: "@expand:{that}.getClasses(storyTelling-storyEditorPrevious)"
            }
        },
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyEdit.html",
                        componentMessages: "%resourcePrefix/src/messages/storyEdit.json"
                    }
                }
            },
            storySpeaker: {
                type: "sjrk.storyTelling.story.storySpeaker"
            }
        }
    });


})(jQuery, fluid);
