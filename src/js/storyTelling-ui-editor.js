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

    fluid.defaults("sjrk.storyTelling.ui.editor", {
        gradeNames: ["sjrk.storyTelling.ui"],
        interfaceControlStrings: {
            storyTitleIdForLabel: "@expand:{that}.getLabelId(title)",
            storyAuthorIdForLabel: "@expand:{that}.getLabelId(author)",
            storyContentIdForLabel: "@expand:{that}.getLabelId(content)",
            storyLanguageIdForLabel: "@expand:{that}.getLabelId(language)",
            storyLanguageListIdForLabel: "@expand:{that}.getLabelId(languageList)",
            storyCategoryListIdForLabel: "@expand:{that}.getLabelId(categoryList)",
            storyTagsIdForLabel: "@expand:{that}.getLabelId(tags)",
            storySummaryIdForLabel: "@expand:{that}.getLabelId(summary)",
            storyLanguageListClasses: "@expand:{that}.getClasses(storyTelling-storyLanguageList)",
            storyAddImagesClasses: "@expand:{that}.getClasses(storyTelling-storyAddImages)",
            storyChoosePhotosClasses: "@expand:{that}.getClasses(storyTelling-storyChoosePhotos)",
            storyTakePhotoClasses: "@expand:{that}.getClasses(storyTelling-storyTakePhoto)",
            storyAddTagsClasses: "@expand:{that}.getClasses(storyTelling-storyAddTags)",
            storyTagsClasses: "@expand:{that}.getClasses(storyTelling-storyTags)",
            storyTranslateClasses: "@expand:{that}.getClasses(storyTelling-storyTranslate)",
            storySubmitClasses: "@expand:{that}.getClasses(storyTelling-storySubmit)",
            storyEditorNextClasses: "@expand:{that}.getClasses(storyTelling-storyEditorNext)",
            storyEditorPreviousClasses: "@expand:{that}.getClasses(storyTelling-storyEditorPrevious)"
        },
        selectors: {
            storySubmit: ".sjrkc-storyTelling-storySubmit",
            storyEditorNext: ".sjrkc-storyTelling-storyEditorNext",
            storyEditorPrevious: ".sjrkc-storyTelling-storyEditorPrevious",
            storyLanguageList: ".sjrkc-storyTelling-storyLanguageList"
        },
        invokers: {
            fireOnStorySubmitRequested: {
                "func": "{that}.events.onStorySubmitRequested.fire"
            }
        },
        bindings: {
            // TODO: revise these references to point to the story component
            storyTitle: "title",
            storyAuthor: "author",
            storyContent: "content",
            storySummary: "summary",
            storyCategories: "categories",
            storyLanguage: "languageFromInput",
            storyLanguageList: "languageFromSelect",
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
        events: {
            onStorySubmitRequested: null,
            onControlsBound: null,
            onEditorNextRequested: null,
            onEditorPreviousRequested: null
        },
        listeners: {
            "onReadyToBind.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.events.onStorySubmitRequested.fire"]
            },
            "onReadyToBind.bindEditorNextControl": {
                "this": "{that}.dom.storyEditorNext",
                "method": "click",
                "args": ["{that}.events.onEditorNextRequested.fire"],
                "priority": "after:bindSubmitControl"
            },
            "onReadyToBind.bindEditorPreviousControl": {
                "this": "{that}.dom.storyEditorPrevious",
                "method": "click",
                "args": ["{that}.events.onEditorPreviousRequested.fire"],
                "priority": "after:bindEditorNextControl"
            }
        },
        modelRelay: {
            clearLanguageInputWhenNotOther: {
                target: "languageFromInput",
                singleTransform: {
                    type: "fluid.transforms.condition",
                    condition: {
                        transform: {
                            type: "fluid.transforms.binaryOp",
                            left: "languageFromSelect",
                            right: "other",
                            operator: "==="
                        }
                    },
                    true: undefined,
                    false: ""
                }
            },
            languageFromUiToModel: {
                target: "{that}.story.model.language",
                singleTransform: {
                    type: "fluid.transforms.condition",
                    condition: "languageFromInput",
                    true: "languageFromInput",
                    false: "languageFromSelect"
                }
            }
        },
        model: {
            languageFromSelect: "",
            languageFromInput: ""
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyEdit.handlebars"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
