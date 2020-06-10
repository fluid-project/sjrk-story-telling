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
        gradeNames: ["sjrk.storyTelling.ui.storyUi"],
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
            // the templateManager for this UI
            templateManager: {
                options: {
                    listeners: {
                        "onTemplateRendered.escalate": "{storyEditor}.events.onEditorTemplateRendered.fire"
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyEditor.handlebars"
                    }
                }
            },
            // for dynamically adding/removing block UIs
            blockManager: {
                container: "{storyEditor}.options.selectors.storyEditorContent",
                options: {
                    distributeOptions: {
                        target: "{that blockUi}.options.listeners",
                        record: {
                            "onMoveBlockDown.moveBlockDown": {
                                func: "{reorderer}.reorderBlockDown",
                                args: ["{arguments}.0.data.container"]
                            },
                            "onMoveBlockUp.moveBlockUp": {
                                func: "{reorderer}.reorderBlockUp",
                                args: ["{arguments}.0.data.container"]
                            }
                        }
                    },
                    blockTypeLookup: {
                        "audio": "sjrk.storyTelling.blockUi.editor.audioBlockEditor",
                        "image": "sjrk.storyTelling.blockUi.editor.imageBlockEditor",
                        "text": "sjrk.storyTelling.blockUi.editor.textBlockEditor",
                        "video": "sjrk.storyTelling.blockUi.editor.videoBlockEditor"
                    },
                    listeners: {
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
                        }
                    }
                }
            },
            // for binding the non-block input fields to the story model
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{storyEditor}.container",
                options: {
                    model: "{story}.model",
                    selectors: "{storyEditor}.options.selectors",
                    events: {
                        onUiReadyToBind: "{storyEditor}.events.onReadyToBind"
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
            },
            reorderer: {
                type: "fluid.reorderList",
                container: "{storyEditor}.dom.storyEditorContent",
                createOnEvent: "{storyEditor}.events.onEditorTemplateRendered",
                options: {
                    disableWrap: true,
                    styles: {
                        avatar: "sjrk-st-reorderer-block-avatar",
                        dropMarker: "sjrk-st-reorderer-block-dropmarker"
                    },
                    selectors: {
                        movables: ".sjrkc-dynamic-view-component",
                        selectables: ".sjrkc-dynamic-view-component",
                        dropTargets: ".sjrkc-dynamic-view-component"
                    },
                    invokers: {
                        reorderBlock: {
                            funcName: "sjrk.storyTelling.ui.storyEditor.reorderBlock",
                            args: ["{that}", "{arguments}.0", "{arguments}.1"] // blockUi, direction
                        },
                        reorderBlockDown: {
                            func: "{that}.reorderBlock",
                            args: ["{arguments}.0", fluid.direction.DOWN]
                        },
                        reorderBlockUp: {
                            func: "{that}.reorderBlock",
                            args: ["{arguments}.0", fluid.direction.UP]
                        }
                    },
                    listeners: {
                        // We should be refreshing the reorderer on each new block
                        // being added, but we can't reliably know when a block
                        // has finished being rendered. It would also be possible
                        // to refresh while a block is being added, which we want
                        // to avoid. This is the workaround:
                        "onCreate.bindFocusListener": {
                            this: "{that}.container",
                            method: "on",
                            args: ["focusin", "{that}.refresh"]
                        }
                    }
                }
            }
        }
    });

    /**
     * Removes all blocks which have been selected in the editor
     *
     * @param {Component} that - an instance of sjrk.storyTelling.ui.storyEditor
     * @param {Object.<String, Component>} managedViewComponentRegistry - the registry of view components
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

        that.blockManager.updateStoryFromBlocks();

        that.events.onRemoveBlocksCompleted.fire(removedBlockKeys);
    };

    /**
     * Reorders the specified block UI component in the specified direction
     *
     * @param {Component} reorderer - an instance of fluid.reorderList
     * @param {Component} blockUi - an instance of sjrk.storyTelling.blockUi
     * @param {Number} direction - a member of fluid.direction
     */
    sjrk.storyTelling.ui.storyEditor.reorderBlock = function (reorderer, blockUi, direction) {
        var relativePosition = reorderer.layoutHandler.getRelativePosition(blockUi, direction);

        reorderer.requestMovement(relativePosition, blockUi);
    };

})(jQuery, fluid);
