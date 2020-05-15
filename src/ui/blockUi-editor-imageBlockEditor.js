/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // an editing interface for individual image-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor"],
        model: {
            // fileUploadState can be one of the following values:
            // "ready" (the initial state), "uploading", "errorReceived"
            fileUploadState: "ready",
            previewVisible: true,
            progressAreaVisible: false,
            responseAreaVisible: false,
            uploadButtonDisabled: false
        },
        modelRelay: {
            "fileUploadState": {
                target: "",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "fileUploadState",
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
        modelListeners: {
            previewVisible: {
                this: "{that}.dom.imagePreview",
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
                this: "{that}.dom.imageUploadButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "uploadButtonDisabledChange"
            }
        },
        selectors: {
            imagePreview: ".sjrkc-st-block-media-preview",
            imageUploadButton: ".sjrkc-st-block-media-upload-button",
            progressArea: ".sjrkc-st-file-share-progress",
            responseArea: ".sjrkc-st-file-share-response",
            responseText: ".sjrkc-st-file-share-response-text",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        invokers: {
            updateImagePreview: {
                this: "{that}.dom.imagePreview",
                method: "attr",
                args: ["src", "{arguments}.0"]
            },
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        events: {
            onImageUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": [
                {
                    this: "{that}.dom.imageUploadButton",
                    method: "click",
                    args: ["{that}.events.onImageUploadRequested.fire"],
                    namespace: "bindOnImageUploadRequested"
                },
                {
                    func: "{blockUi}.updateImagePreview",
                    args: ["{that}.block.model.imageUrl"],
                    namespace: "updateImagePreview"
                }
            ]
        },
        components: {
            // the block itself
            block: {
                type: "sjrk.storyTelling.block.imageBlock",
                options: {
                    model: {
                        // imageURL: relayed from uploader
                        // fileDetails: relayed from uploader
                    }
                }
            },
            // the block's templateManager
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBlockMediaEdit.handlebars"
                    }
                }
            },
            // binds the DOM to infusion model endpoints
            binder: {
                options: {
                    selectors: {
                        imageAltText: ".sjrkc-st-block-media-alt-text",
                        imageDescription: ".sjrkc-st-block-media-description"
                    },
                    bindings: {
                        imageAltText: "alternativeText",
                        imageDescription: "description"
                    }
                }
            },
            // handles previewing and uploading a single image for storage
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{imageBlockEditor}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectUrl: "{block}.model.imageUrl",
                        fileDetails: "{block}.model.fileDetails",
                        storyId: "{editor}.storyId"
                    },
                    listeners: {
                        "{imageBlockEditor}.events.onImageUploadRequested": {
                            func: "{that}.events.onFileSelectionRequested.fire",
                            namespace: "fireSelectionForImageUpload"
                        },
                        "onUploadRequested": {
                            func: "{imageBlockEditor}.applier.change",
                            args: ["fileUploadState", "uploading"],
                            namespace: "setStateUploading"
                        },
                        "onUploadComplete": [
                            {
                                func: "{imageBlockEditor}.applier.change",
                                args: ["fileUploadState", "ready"],
                                namespace: "setStateReady"
                            },
                            {
                                func: "{imageBlockEditor}.setServerResponse",
                                args: [""],
                                namespace: "clearServerResponse"
                            }
                        ],
                        "onUploadError": [
                            {
                                func: "{imageBlockEditor}.applier.change",
                                args: ["fileUploadState", "errorReceived"],
                                namespace: "setStateErrorReceived"
                            },
                            {
                                func: "{imageBlockEditor}.setServerResponse",
                                args: ["{arguments}.0.message"],
                                namespace: "setServerResponse"
                            }
                        ]
                    },
                    modelListeners: {
                        "fileObjectUrl": {
                            func: "{imageBlockEditor}.updateImagePreview",
                            args: "{that}.model.fileObjectUrl",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
