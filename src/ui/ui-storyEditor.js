/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

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
            onRemoveBlocksCompleted: null
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
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyEditor.hbs"
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
                            "onMoveBlock.reorderBlock": {
                                func: "{reorderer}.reorderBlock",
                                args: ["{that}.container", "{arguments}.0.data"]
                            }
                        }
                    },
                    blockTypeLookup: {
                        "audio": "sjrk.storyTelling.blockUi.editor.audioBlockEditor",
                        "image": "sjrk.storyTelling.blockUi.editor.imageBlockEditor",
                        "text": "sjrk.storyTelling.blockUi.editor.textBlockEditor",
                        "video": "sjrk.storyTelling.blockUi.editor.videoBlockEditor"
                    },
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                model: {
                                    storyId: "{story}.model.id"
                                }
                            }
                        }
                    },
                    listeners: {
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
                    listeners: {
                        "{storyEditor}.events.onReadyToBind": {
                            func: "{that}.events.onUiReadyToBind",
                            namespace: "applyStoryEditorBinding"
                        }
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
                createOnEvent: "{storyEditor}.events.onReadyToBind",
                options: {
                    disableWrap: true,
                    selectablesTabindex: 0,
                    styles: {
                        avatar: "sjrk-st-reorderer-block-avatar",
                        dropMarker: "sjrk-st-reorderer-block-dropmarker"
                    },
                    selectors: {
                        movables: ".sjrkc-dynamic-view-component",
                        selectables: ".sjrkc-dynamic-view-component",
                        dropTargets: ".sjrkc-dynamic-view-component",
                        grabHandle: ".sjrkc-st-reorderer-grab-handle"
                    },
                    invokers: {
                        reorderBlock: {
                            funcName: "sjrk.storyTelling.ui.storyEditor.reorderBlock",
                            args: ["{that}", "{arguments}.0", "{arguments}.1"] // blockUi, direction
                        }
                    },
                    listeners: {
                        // TODO: This listener is necessary to avoid a race condition that
                        // is created when the refresh operation is being run while
                        // a new block is still being added. If the DOM container
                        // for a new block is present but its template has not been
                        // rendered, the operation will fail.
                        //
                        // This bug and a potential solution are detailed in SJRK-369:
                        // https://issues.fluidproject.org/browse/SJRK-369
                        "onCreate.bindFocusListener": {
                            this: "{that}.container",
                            method: "on",
                            args: ["focusin", "{that}.refresh"]
                        },
                        "onRefresh.updateBlockOrderAfterReorder": {
                            func: "sjrk.storyTelling.ui.storyEditor.updateBlockOrder",
                            args: ["{storyEditor}"]
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
                // If it's a media block, reset its uploadState before removing
                if (managedComponent.singleFileUploader) {
                    managedComponent.singleFileUploader.resetUploadState();
                }

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
     * @param {jQuery} blockUi - a jQueryable of an sjrk.storyTelling.blockUi.editor's container
     * @param {Number} direction - a member of fluid.direction
     */
    sjrk.storyTelling.ui.storyEditor.reorderBlock = function (reorderer, blockUi, direction) {
        var relativePosition = reorderer.layoutHandler.getRelativePosition(blockUi, direction);

        reorderer.requestMovement(relativePosition, blockUi);
    };

    /**
     * Updates the order of each block model according to the order of the blockUi
     * elements in the story content editing area
     *
     * @param {Component} that - an instance of sjrk.storyTelling.ui.storyUi
     */
    sjrk.storyTelling.ui.storyEditor.updateBlockOrder = function (that) {
        var blockUis = that.reorderer.container.children();

        // used to retrieve the class name for each block
        // within the blockManager's managedViewComponentRegistry
        var managedClassNamePattern = sjrk.storyTelling.ui.storyEditor.getManagedClassNamePattern(that.blockManager.options.selectors.managedViewComponents);

        for (var i = 0; i < blockUis.length; i++) {
            // TODO: The way the class name is found is overly complex and should be rewritten.
            // This work is outlined in SJRK-371:
            //
            // https://issues.fluidproject.org/browse/SJRK-371
            var managedClassName = fluid.find(blockUis[i].classList, function (value) {
                if (typeof value === "string") {
                    var patternMatches = value.match(managedClassNamePattern);
                    return patternMatches === null ? undefined : patternMatches.input;
                }
            });

            var block = that.blockManager.managedViewComponentRegistry[managedClassName].block;

            block.applier.change("", {
                order: i,
                firstInOrder: i === 0,
                lastInOrder: i === blockUis.length - 1
            });
        }

        // sort the content array in the story model, now that the block orders are updated
        sjrk.storyTelling.ui.storyEditor.sortStoryContent(that.story);
    };

    /**
     * Builds a class selector pattern that can, for example, be matched against a
     * list of class names of a managed dynamic view component (e.g. a blockUi)
     *
     * @param {String} managedViewComponentSelector - a CSS selector
     *
     * @return {String} - a selector, or `undefined` if the `managedViewComponentSelector` is not a string.
     */
    sjrk.storyTelling.ui.storyEditor.getManagedClassNamePattern = function (managedViewComponentSelector) {
        if (managedViewComponentSelector && typeof managedViewComponentSelector === "string") {
            return "^" + managedViewComponentSelector.substring(1) + "-";
        } else {
            return undefined;
        }
    };

    /**
     * Sorts a story's content array (block model array) according to
     * each block's `order` value. If any order value is non-numeric, nothing
     * will be changed or updated
     *
     * @param {Component} story - an instance of sjrk.storyTelling.story
     */
    sjrk.storyTelling.ui.storyEditor.sortStoryContent = function (story) {
        var invalidOrderPresent = false;
        fluid.each(story.model.content, function (block) {
            if (typeof block.order !== "number") {
                invalidOrderPresent = true;
            }
        });

        if (invalidOrderPresent) {
            return;
        } else {
            var contentCopy = fluid.copy(story.model.content);

            fluid.stableSort(contentCopy, function (a, b) {
                if (a.order > b.order) {
                    return 1;
                } else if (a.order < b.order) {
                    return -1;
                } else {
                    return 0;
                }
            });

            var storyUpdateTransaction = story.applier.initiate();
            storyUpdateTransaction.fireChangeRequest({path: "content", type: "DELETE"});
            storyUpdateTransaction.fireChangeRequest({path: "content", value: contentCopy});
            storyUpdateTransaction.commit();
        }
    };

})(jQuery, fluid);
