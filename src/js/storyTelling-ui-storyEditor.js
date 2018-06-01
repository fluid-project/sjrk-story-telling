/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // a UI for editing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyEditor", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            storySubmit: ".sjrkc-storyTelling-storySubmit",
            storyEditorContent: ".sjrkc-storyTelling-story-editor-content",
            storyEditorNext: ".sjrkc-storyTelling-storyEditorNext",
            storyEditorPrevious: ".sjrkc-storyTelling-storyEditorPrevious",
            storyEditorPage1: ".sjrkc-storyTelling-storyEditorPage1",
            storyEditorPage2: ".sjrkc-storyTelling-storyEditorPage2",
            storyAddTextBlock: ".sjrkc-storyTelling-button-text-block",
            storyAddImageBlock: ".sjrkc-storyTelling-button-image-block",
            storyRemoveSelectedBlocks: ".sjrkc-storyTelling-button-remove-blocks",
            storyRestoreRemovedBlocks: ".sjrkc-storyTelling-button-restore-blocks"
        },
        blockTypeLookup: {
            "text": "sjrk.storyTelling.blockUi.editor.textBlockEditor",
            "image": "sjrk.storyTelling.blockUi.editor.imageBlockEditor"
        },
        events: {
            onStorySubmitRequested: null,
            onEditorNextRequested: null,
            onEditorPreviousRequested: null,
            onTextBlockAdditionRequested: null,
            onImageBlockAdditionRequested: null,
            onRemoveBlocksRequested: null,
            onRemoveBlocksCompleted: null,
            onRestoreBlocksRequested: null,
            onUpdateStoryFromBlocksRequested: null,
            onStoryUpdatedFromBlocks: null
        },
        listeners: {
            "onReadyToBind.bindAddTextBlock": {
                "this": "{that}.dom.storyAddTextBlock",
                "method": "click",
                "args": ["{that}.events.onTextBlockAdditionRequested.fire"]
            },
            "onReadyToBind.bindAddImageBlock": {
                "this": "{that}.dom.storyAddImageBlock",
                "method": "click",
                "args": ["{that}.events.onImageBlockAdditionRequested.fire"]
            },
            "onReadyToBind.bindRemoveSelectedBlocks": {
                "this": "{that}.dom.storyRemoveSelectedBlocks",
                "method": "click",
                "args": ["{that}.events.onRemoveBlocksRequested.fire"]
            },
            "onReadyToBind.bindSubmitControl": {
                "this": "{that}.dom.storySubmit",
                "method": "click",
                "args": ["{that}.events.onStorySubmitRequested.fire"]
            },
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
            },
            "onRemoveBlocksRequested.removeSelectedBlocks": {
                funcName: "sjrk.storyTelling.ui.storyEditor.removeSelectedBlocks",
                args: ["{that}", "{that}.blockManager.managedViewComponentRegistry"]
            }
        },
        components: {
            // represents the story data
            story: {
                type: "sjrk.storyTelling.story"
            },
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{story}.model"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyEditor.handlebars"
                    }
                }
            },
            // for dynamically adding/removing block UIs
            blockManager: {
                type: "sjrk.dynamicViewComponentManager",
                container: "{ui}.options.selectors.storyEditorContent",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    listeners: {
                        "onCreate.createBlocksFromData": {
                            "funcName": "sjrk.storyTelling.ui.createBlocksFromData",
                            "args": ["{story}.model.content", "{storyEditor}.options.blockTypeLookup", "{blockManager}.events.viewComponentContainerRequested"]
                        },
                        "{storyEditor}.events.onTextBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addTextBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                        },
                        "{storyEditor}.events.onImageBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addImageBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                        },
                        "{storyEditor}.events.onUpdateStoryFromBlocksRequested": {
                            funcName: "sjrk.storyTelling.ui.updateStoryFromBlocks",
                            namespace: "updateStoryFromBlocks",
                            args: ["{storyEditor}.story", "{that}.managedViewComponentRegistry", "{storyEditor}.events.onStoryUpdatedFromBlocks"],
                            priority: "first"
                        }
                    },
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                components: {
                                    templateManager: {
                                        options: {
                                            model: {
                                                locale: "{ui}.templateManager.model.locale"
                                            }
                                        }
                                    },
                                    block: {
                                        options: {
                                            gradeNames: ["{that}.getBlockGrade"],
                                            invokers: {
                                                "getBlockGrade": {
                                                    funcName: "sjrk.storyTelling.ui.getBlockGradeFromEventModelValues",
                                                    args: ["{blockUi}.options.additionalConfiguration.modelValues"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // for binding the non-block input fields to the story model
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{ui}.container",
                options: {
                    model: "{story}.model",
                    selectors: "{ui}.options.selectors",
                    events: {
                        onUiReadyToBind: "{ui}.events.onReadyToBind"
                    },
                    bindings: {
                        storyTitle: "title",
                        storyAuthor: "author",
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
                    }
                }
            }
        }
    });

    /* Removes all blocks which have been selected in the editor
     * - "that": the story editor UI
     * - "managedViewComponentRegistry": the registry of view components
     */
    sjrk.storyTelling.ui.storyEditor.removeSelectedBlocks = function (that, managedViewComponentRegistry)
    {
        var removedBlockKeys = [];

        fluid.each(managedViewComponentRegistry, function (managedComponent, blockKey) {
            var checked = managedComponent.locate("selectedCheckbox").prop("checked");

            if (checked) {
                managedComponent.destroy();
                removedBlockKeys.push(blockKey);
            }
        });
        that.events.onRemoveBlocksCompleted.fire(removedBlockKeys);
    };

})(jQuery, fluid);
