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

    // an editing interface for individual media blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.mediaBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor", "sjrk.storyTelling.blockUi.timeBased"],
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
                this: "{that}.dom.mediaPlayer",
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
                this: "{that}.dom.mediaUploadButton",
                method: "prop",
                args: ["disabled", "{change}.value"],
                namespace: "uploadButtonDisabledChange"
            }
        },
        selectors: {
            mediaUploadButton: ".sjrkc-st-block-media-upload-button",
            progressArea: ".sjrkc-st-file-share-progress",
            responseArea: ".sjrkc-st-file-share-response",
            responseText: ".sjrkc-st-file-share-response-text",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        invokers: {
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        events: {
            onMediaUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.mediaUploadButton",
                method: "click",
                args: ["{that}.events.onMediaUploadRequested.fire"],
                namespace: "bindOnMediaUploadRequested"
            }
        },
        components: {
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
                        mediaAltText: ".sjrkc-st-block-media-alt-text",
                        mediaDescription: ".sjrkc-st-block-media-description"
                    },
                    bindings: {
                        mediaAltText: "alternativeText",
                        mediaDescription: "description"
                    }
                }
            },
            // handles previewing and uploading a single file for storage
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{mediaBlockEditor}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectUrl: "{block}.model.mediaUrl",
                        storyId: "{editor}.storyId"
                    },
                    listeners: {
                        "{mediaBlockEditor}.events.onMediaUploadRequested": {
                            func: "{that}.events.onFileSelectionRequested.fire",
                            namespace: "fireSelectionForMediaUpload"
                        },
                        "onUploadRequested": {
                            func: "{mediaBlockEditor}.applier.change",
                            args: ["fileUploadState", "uploading"],
                            namespace: "setStateUploading"
                        },
                        "onUploadComplete": [
                            {
                                func: "{mediaBlockEditor}.applier.change",
                                args: ["fileUploadState", "ready"],
                                namespace: "setStateReady"
                            },
                            {
                                func: "{mediaBlockEditor}.setServerResponse",
                                args: [""],
                                namespace: "clearServerResponse"
                            }
                        ],
                        "onUploadError": [
                            {
                                func: "{mediaBlockEditor}.applier.change",
                                args: ["fileUploadState", "errorReceived"],
                                namespace: "setStateErrorReceived"
                            },
                            {
                                func: "{mediaBlockEditor}.setServerResponse",
                                args: ["{arguments}.0.message"],
                                namespace: "setServerResponse"
                            }
                        ]
                    },
                    modelListeners: {
                        "fileObjectUrl": {
                            func: "{mediaBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectUrl",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
