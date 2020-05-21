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

    // the base blockUi for editing individual blocks, contains shared elements
    fluid.defaults("sjrk.storyTelling.blockUi.editor", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        members: {
            // the ID of the story of which the block being edited is a part
            storyId: ""
        },
        selectors: {
            selectedCheckbox: ".sjrkc-st-block-selection-checkbox"
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
                    events: {
                        onUiReadyToBind: "{templateManager}.events.onTemplateRendered"
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
                        "uploadState": {
                            target: "{editor}.model",
                            singleTransform: {
                                type: "fluid.transforms.valueMapper",
                                defaultInputPath: "uploadState",
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
                        storyId: "{editor}.storyId"
                    },
                    listeners: {
                        "{editor}.events.onMediaUploadRequested": {
                            func: "{that}.events.onFileSelectionRequested.fire",
                            namespace: "fireSelectionForFileUpload"
                        },
                        "onUploadComplete": {
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

})(jQuery, fluid);
