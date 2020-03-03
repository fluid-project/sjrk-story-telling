/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    // a UI for editing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyEditor", {
        gradeNames: ["sjrk.storyTelling.ui"],
        model: {
            // this is the initial state of the visibility
            editStoryStepVisible: true,
            metadataStepVisible: false
        },
        modelRelay: {
            editorStepVisibilityMutex: {
                source: "editStoryStepVisible",
                target: "metadataStepVisible",
                singleTransform: {
                    type: "sjrk.storyTelling.transforms.not"
                }
            }
        },
        modelListeners: {
            "editStoryStepVisible": {
                this: "{that}.dom.storyEditStoryStep",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "setEditStoryStepVisibility"
            },
            "metadataStepVisible": {
                this: "{that}.dom.storyMetadataStep",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "setMetadataStepVisibility"
            }
        },
        selectors: {
            storySubmit: ".sjrkc-st-story-submit",
            storyEditorForm: ".sjrkc-st-story-editor-form",
            storyEditorContent: ".sjrkc-st-story-editor-content",
            storyEditorNext: ".sjrkc-st-story-editor-next",
            storyEditorPrevious: ".sjrkc-st-story-editor-previous",
            storyEditStoryStep: ".sjrkc-st-story-editor-edit-story-step",
            storyMetadataStep: ".sjrkc-st-story-editor-metadata-step",
            storyAddAudioBlock: ".sjrkc-st-button-audio-block",
            storyAddImageBlock: ".sjrkc-st-button-image-block",
            storyAddTextBlock: ".sjrkc-st-button-text-block",
            storyAddVideoBlock: ".sjrkc-st-button-video-block",
            storyRemoveSelectedBlocks: ".sjrkc-st-button-remove-blocks"
        },
        blockTypeLookup: {
            "audio": "sjrk.storyTelling.blockUi.editor.audioBlockEditor",
            "image": "sjrk.storyTelling.blockUi.editor.imageBlockEditor",
            "text": "sjrk.storyTelling.blockUi.editor.textBlockEditor",
            "video": "sjrk.storyTelling.blockUi.editor.videoBlockEditor"
        },
        events: {
            onStorySubmitRequested: null,
            onEditorNextRequested: null,
            onEditorPreviousRequested: null,
            onAudioBlockAdditionRequested: null,
            onImageBlockAdditionRequested: null,
            onTextBlockAdditionRequested: null,
            onVideoBlockAdditionRequested: null,
            onRemoveBlocksRequested: null,
            onRemoveBlocksCompleted: null,
            onUpdateStoryFromBlocksRequested: null,
            onStoryUpdatedFromBlocks: null,
            onEditorTemplateRendered: null,
            onBlockManagerCreated: null,
            onReadyToBind: {
                events: {
                    onEditorTemplateRendered: "{that}.events.onEditorTemplateRendered",
                    onBlockManagerCreated: "{that}.events.onBlockManagerCreated"
                }
            }
        },
        listeners: {
            "onReadyToBind.bindAddAudioBlock": {
                "this": "{that}.dom.storyAddAudioBlock",
                "method": "click",
                "args": ["{that}.events.onAudioBlockAdditionRequested.fire"]
            },
            "onReadyToBind.bindAddImageBlock": {
                "this": "{that}.dom.storyAddImageBlock",
                "method": "click",
                "args": ["{that}.events.onImageBlockAdditionRequested.fire"]
            },
            "onReadyToBind.bindAddTextBlock": {
                "this": "{that}.dom.storyAddTextBlock",
                "method": "click",
                "args": ["{that}.events.onTextBlockAdditionRequested.fire"]
            },
            "onReadyToBind.bindAddVideoBlock": {
                "this": "{that}.dom.storyAddVideoBlock",
                "method": "click",
                "args": ["{that}.events.onVideoBlockAdditionRequested.fire"]
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
            "onRemoveBlocksRequested.removeSelectedBlocks": {
                funcName: "sjrk.storyTelling.ui.storyEditor.removeSelectedBlocks",
                args: ["{that}", "{that}.blockManager.managedViewComponentRegistry"]
            },
            "onEditorNextRequested.hideEditStoryStep": {
                func: "{that}.showEditStoryStep",
                args: [false]
            },
            "onEditorPreviousRequested.showEditStoryStep": {
                func: "{that}.showEditStoryStep",
                args: [true]
            }
        },
        invokers: {
            showEditStoryStep: {
                func: "{that}.applier.change",
                args: ["editStoryStepVisible", "{arguments}.0"]
            }
        },
        components: {
            // represents the story data
            story: {
                type: "sjrk.storyTelling.story"
            },
            // the templateManager for this UI
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            story: "{story}.model"
                        }
                    },
                    listeners: {
                        "onTemplateRendered.escalate": "{ui}.events.onEditorTemplateRendered.fire"
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyEditor.handlebars"
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
                        "onCreate.escalate": {
                            func: "{storyEditor}.events.onBlockManagerCreated.fire",
                            priority: "last"
                        },
                        "{storyEditor}.events.onAudioBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addAudioBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.audioBlockEditor"]
                        },
                        "{storyEditor}.events.onImageBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addImageBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                        },
                        "{storyEditor}.events.onTextBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addTextBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                        },
                        "{storyEditor}.events.onVideoBlockAdditionRequested": {
                            func: "{that}.events.viewComponentContainerRequested",
                            namespace: "addVideoBlock",
                            args: ["sjrk.storyTelling.blockUi.editor.videoBlockEditor"]
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

    /**
     * Removes all blocks which have been selected in the editor
     *
     * @param {Object} that - the story editor UI
     * @param {Object} managedViewComponentRegistry - the registry of view components
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
