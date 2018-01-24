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

    fluid.defaults("sjrk.storyTelling.ui.editor", {
        gradeNames: ["sjrk.storyTelling.ui"],
        // TODO: figure out what to do with the UI control selectors
        selectors: {
            storySubmit: ".sjrkc-storyTelling-storySubmit",
            storyListenTo: ".sjrkc-storyTelling-storyListenTo",
            storyEditorNext: ".sjrkc-storyTelling-storyEditorNext",
            storyEditorPrevious: ".sjrkc-storyTelling-storyEditorPrevious",
            storyEditorPage1: ".sjrkc-storyTelling-storyEditorPage1",
            storyEditorPage2: ".sjrkc-storyTelling-storyEditorPage2"
        },
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
        invokers: {
            fireOnStorySubmitRequested: {
                "func": "{that}.events.onStorySubmitRequested.fire"
            }
        },
        events: {
            onStorySubmitRequested: null,
            onEditorNextRequested: null,
            onEditorPreviousRequested: null
        },
        listeners: {
            "onReadyToBind.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.events.onStorySubmitRequested.fire"]
            },
            // TODO: move storySpeaker listener to uiManager grade
            // "onReadyToBind.bindListenToControl": {
            //     "this": "{that}.dom.storyListenTo",
            //     "method": "click",
            //     "args": ["{that}.events.onStoryListenToRequested.fire"]
            // },
            "onReadyToBind.bindEditorNextControl": {
                "this": "{that}.dom.storyEditorNext",
                "method": "click",
                "args": ["{that}.events.onEditorNextRequested.fire"]
            },
            "onReadyToBind.bindEditorPreviousControl": {
                "this": "{that}.dom.storyEditorPrevious",
                "method": "click",
                "args": ["{that}.events.onEditorPreviousRequested.fire"]
            },
            "onEditorNextRequested.manageVisibility": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{that}.dom.storyEditorPage1"],
                    ["{that}.dom.storyEditorPage2"],
                    "{that}.events.onVisibilityChanged"
                ]
            },
            "onEditorPreviousRequested.manageVisibility": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{that}.dom.storyEditorPage2"],
                    ["{that}.dom.storyEditorPage1"],
                    "{that}.events.onVisibilityChanged"
                ]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyEdit.handlebars"
                    }
                }
            },
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{ui}.container",
                options: {
                    model: "{story}.model",
                    selectors: "{ui}.options.selectors",
                    bindings: {
                        storyTitle: "title",
                        storyAuthor: "author",
                        storyContent: "content",
                        storySummary: "summary",
                        storyLanguage: "languageFromInput",
                        storyLanguageList: "languageFromSelect",
                        storyCategories: "categories",
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
                    modelRelay: {
                        clearLanguageInputWhenNotOther: {
                            target: "languageFromInput",
                            singleTransform: {
                                type: "fluid.transforms.condition",
                                condition: {
                                    transform: {
                                        type: "fluid.transforms.binaryOp",
                                        left: "{that}.model.languageFromSelect",
                                        right: "other",
                                        operator: "==="
                                    }
                                },
                                false: ""
                            }
                        },
                        languageFromUiToModel: {
                            target: "language",
                            singleTransform: {
                                type: "fluid.transforms.condition",
                                condition: "{that}.model.languageFromInput",
                                true: "{that}.model.languageFromInput",
                                false: "{that}.model.languageFromSelect"
                            }
                        }
                    },
                    events: {
                        onUiReadyToBind: "{ui}.events.onReadyToBind"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.ui.manageVisibility = function (hideElements, showElements, completionEvent) {
        fluid.each(hideElements, function (el) {
            el.hide();
        });

        fluid.each(showElements, function (el) {
            el.show();
        });

        completionEvent.fire();
    };

})(jQuery, fluid);
