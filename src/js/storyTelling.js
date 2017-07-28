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

    fluid.defaults("sjrk.storyTelling", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            onStoryTemplateAppended: null,
            onStorySubmitRequestedFromEditor: null
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor"
        },
        listeners: {
            "onCreate.appendStoryTemplate": {
                "this": "{that}.container",
                "method": "append",
                "args": ["<div class='sjrkc-storyTelling-storyEditor'></div><div class='sjrkc-storyTelling-storyViewer'></div>"]
            },
            "onCreate.fireOnStoryTemplateAppend": {
                "func": "{that}.events.onStoryTemplateAppended.fire",
                "priority": "after:appendStoryTemplate"
            }
        },
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.storyEditor",
                container: ".sjrkc-storyTelling-storyEditor",
                createOnEvent: "{storyTelling}.events.onStoryTemplateAppended",
                options: {
                    events: {
                        onStorySubmitRequested: "{storyTelling}.events.onStorySubmitRequestedFromEditor"
                    }
                }
            },
            storyViewer: {
                type: "sjrk.storyTelling.storyViewer",
                container: ".sjrkc-storyTelling-storyViewer",
                createOnEvent: "{storyTelling}.events.onStorySubmitRequestedFromEditor"
            }
        }
    });

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
            translations: []
        }
    });

    fluid.defaults("sjrk.storyTelling.storyEditor", {
        gradeNames: ["sjrk.storyTelling.story", "sjrk.storyTelling.templatedComponentWithBinder"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent",
            storySubmit: ".sjrkc-storyTelling-storySubmit"
        },
        events: {
            onStorySubmitRequested: null
        },
        listeners: {
            "onTemplateRendered.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.fireOnStorySubmitRequested"]
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
            storyContent: "content"
        },
        templateTerms: {
            storyTitleIdForLabel: "@expand:{that}.getLabelId(title)",
            storyAuthorIdForLabel: "@expand:{that}.getLabelId(author)",
            storyContentIdForLabel: "@expand:{that}.getLabelId(content)",
            storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
            storyAddPhotosClasses: "@expand:{that}.getClasses(storyTelling-storyAddPhotos)",
            storyAddTagsClasses: "@expand:{that}.getClasses(storyTelling-storyAddTags)",
            storyCreateSummaryClasses: "@expand:{that}.getClasses(storyTelling-storyCreateSummary)",
            storyTranslateClasses: "@expand:{that}.getClasses(storyTelling-storyTranslate)",
            storyTitleClasses:
            "@expand:{that}.getClasses(storyTelling-storyTitle)",
            storyAuthorClasses:
            "@expand:{that}.getClasses(storyTelling-storyAuthor)",
            storyContentClasses:
            "@expand:{that}.getClasses(storyTelling-storyContent)",
            storySubmitClasses: "@expand:{that}.getClasses(storyTelling-storySubmit)"
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

    fluid.defaults("sjrk.storyTelling.storyViewer", {
        gradeNames: ["sjrk.storyTelling.story", "sjrk.storyTelling.templatedComponent"],
        templateTerms: {
            storyTitle: "{that}.model.title",
            storyContent: "{that}.model.content",
            storyAuthor: "{that}.model.author",
            storyTags: {
                expander: {
                    func: "sjrk.storyTelling.storyViewer.tagArrayToDisplayString",
                    args: ["{that}.model.tags"]
                }
            },
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
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "src/templates/storyView.html"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.storyViewer.tagArrayToDisplayString = function (array) {
        return array.join(", ");
    };

})(jQuery, fluid);
