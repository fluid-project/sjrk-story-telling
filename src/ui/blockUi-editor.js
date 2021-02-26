/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // the base blockUi for editing individual blocks, contains shared elements
    fluid.defaults("sjrk.storyTelling.blockUi.editor", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        model: {
            // the ID of the story of which the block being edited is a part
            storyId: "",
            moveBlockDownDisabled: true,
            moveBlockUpDisabled: true
        },
        modelRelay: {
            // reorder buttons are disabled depending on the block's order:
            // if the block is last in the order, the "down" button is disabled
            blockLastInOrderToDownButtonDisabled: {
                source: "{block}.model.lastInOrder",
                target: "moveBlockDownDisabled",
                singleTransform: {
                    type: "fluid.transforms.identity"
                },
                backward: "never"
            },
            // if the block is first in the order, the "up" button is disabled
            blockFirstInOrderToUpButtonDisabled: {
                source: "{block}.model.firstInOrder",
                target: "moveBlockUpDisabled",
                singleTransform: {
                    type: "fluid.transforms.identity"
                },
                backward: "never"
            }
        },
        modelListeners: {
            // The use of excludeSource: ["init"] in these two model listeners
            // is to prevent calling the invoker on model initialization, which
            // would have no effect as it would occur before the template is
            // rendered. This can be improved with some changes to the templateManager
            // grade which are described in SJRK-364:
            // https://issues.fluidproject.org/browse/SJRK-364
            //
            // This is also discussed in review for SJRK-288/SJRK-359 pull request:
            // https://github.com/fluid-project/sjrk-story-telling/pull/84#pullrequestreview-431017684
            "moveBlockDownDisabled": {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockDownButton", "{change}.value"],
                excludeSource: ["init"],
                namespace: "setMoveBlockDownDisabled"
            },
            "moveBlockUpDisabled": {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockUpButton", "{change}.value"],
                excludeSource: ["init"],
                namespace: "setMoveBlockUpDisabled"
            }
        },
        selectors: {
            moveBlockDownButton: ".sjrkc-st-reorderer-move-down",
            moveBlockUpButton: ".sjrkc-st-reorderer-move-up",
            selectedCheckbox: ".sjrkc-st-block-selection-checkbox"
        },
        events: {
            onReadyToBind: null,
            onMoveBlock: null
        },
        invokers: {
            setButtonDisabled: "sjrk.storyTelling.blockUi.editor.setButtonDisabled"
        },
        listeners: {
            "onReadyToBind": [{
                this: "{that}.dom.moveBlockDownButton",
                method: "click",
                args: [fluid.direction.DOWN, "{that}.events.onMoveBlock.fire"],
                namespace: "bindBlockDownButton"
            },
            {
                this: "{that}.dom.moveBlockUpButton",
                method: "click",
                args: [fluid.direction.UP, "{that}.events.onMoveBlock.fire"],
                namespace: "bindBlockUpButton"
            },
            {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockDownButton", "{that}.model.moveBlockDownDisabled"],
                namespace: "setMoveBlockDownDisabledOnReady"
            },
            {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockUpButton", "{that}.model.moveBlockUpDisabled"],
                namespace: "setMoveBlockUpDisabledOnReady"
            }]
        },
        components: {
            // binds user input DOM elements to model values on the block
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{blockUi}.container",
                options: {
                    model: "{block}.model",
                    selectors: {
                        heading: ".sjrkc-st-block-heading"
                    },
                    bindings: {
                        heading: "heading"
                    },
                    listeners: {
                        "{editor}.events.onReadyToBind": {
                            func: "{that}.events.onUiReadyToBind",
                            namespace: "applyBinding"
                        }
                    }
                }
            },
            // loads the localized messages and template for the block
            templateManager: {
                options: {
                    listeners: {
                        "onTemplateRendered.escalate": "{editor}.events.onReadyToBind"
                    }
                }
            }
        }
    });

    // a block editor that includes a progress indicator
    fluid.defaults("sjrk.storyTelling.blockUi.editor.withFileUploader", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor"],
        model: {
            previewVisible: true,
            progressAreaVisible: false,
            responseAreaVisible: false,
            uploadButtonDisabled: false
        },
        modelListeners: {
            previewVisible: {
                this: "{that}.dom.mediaPreview",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "previewVisibleChange"
            },
            progressAreaVisible: {
                this: "{that}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "progressAreaVisibleChange"
            },
            responseAreaVisible: {
                this: "{that}.dom.responseArea",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "responseAreaVisibleChange"
            },
            uploadButtonDisabled: {
                this: "{that}.dom.uploadButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "uploadButtonDisabledChange"
            }
        },
        selectors: {
            mediaPreview: ".sjrkc-st-block-media-preview",
            progressArea: ".sjrkc-st-file-share-progress",
            responseArea: ".sjrkc-st-file-share-response",
            responseText: ".sjrkc-st-file-share-response-text",
            singleFileUploader: ".sjrkc-st-block-uploader-input",
            uploadButton: ".sjrkc-st-block-media-upload-button"
        },
        invokers: {
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            },
            updateMediaPreview: null // to be specified by implementing grades
        },
        events: {
            onMediaUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.uploadButton",
                method: "click",
                args: ["{that}.events.onMediaUploadRequested.fire"],
                namespace: "bindOnMediaUploadRequested"
            }
        },
        components: {
            // handles uploading a single file for storage
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{editor}.dom.singleFileUploader",
                options: {
                    modelRelay: {
                        uploadStateToDomFlags: {
                            target: "{editor}.model",
                            singleTransform: {
                                type: "fluid.transforms.valueMapper",
                                defaultInput: "{that}.model.uploadState",
                                match: {
                                    "ready": {
                                        outputValue: {
                                            previewVisible: true,
                                            progressAreaVisible: false,
                                            responseAreaVisible: false,
                                            uploadButtonDisabled: false
                                        }
                                    },
                                    "uploading": {
                                        outputValue: {
                                            previewVisible: false,
                                            progressAreaVisible: true,
                                            responseAreaVisible: false,
                                            uploadButtonDisabled: true
                                        }
                                    },
                                    "errorReceived": {
                                        outputValue: {
                                            previewVisible: true,
                                            progressAreaVisible: false,
                                            responseAreaVisible: true,
                                            uploadButtonDisabled: false
                                        }
                                    }
                                }
                            }
                        }
                    },
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectUrl: "{block}.model.mediaUrl",
                        storyId: "{editor}.model.storyId"
                    },
                    listeners: {
                        "{editor}.events.onMediaUploadRequested": {
                            func: "{that}.events.onFileSelectionRequested",
                            namespace: "fireSelectionForFileUpload"
                        },
                        "onUploadSuccess": {
                            func: "{editor}.setServerResponse",
                            args: [""],
                            namespace: "clearServerResponse"
                        },
                        "onUploadError": {
                            func: "{editor}.setServerResponse",
                            args: ["{arguments}.0.message"],
                            namespace: "setServerResponse"
                        }
                    },
                    modelListeners: {
                        "fileObjectUrl": {
                            func: "{editor}.updateMediaPreview",
                            args: "{that}.model.fileObjectUrl",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.blockUi.editor.setButtonDisabled = function (button, isDisabled) {
        $(button).prop("disabled", isDisabled);
    };

})(jQuery, fluid);
