/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // an editing interface for individual video-type blocks
    // provides additional capabilities depending on whether the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.mobileCameraAware", "sjrk.storyTelling.blockUi.editor", "sjrk.storyTelling.blockUi.timeBased"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        gradeNames: "sjrk.storyTelling.blockUi.editor.videoBlockEditor.hasMobileCamera"
                    }
                }
            }
        },
        selectors: {
            videoUploadButton: ".sjrkc-st-block-media-upload-button",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        events: {
            onVideoUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.videoUploadButton",
                method: "click",
                args: ["{that}.events.onVideoUploadRequested.fire"],
                namespace: "bindOnVideoUploadRequested"
            }
        },
        components: {
            block: {
                type: "sjrk.storyTelling.block.videoBlock",
                options: {
                    model: {
                        // mediaUrl: relayed from uploader
                        // fileDetails: relayed from uploader
                    }
                }
            },
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockVideo.handlebars"
                    }
                }
            },
            binder: {
                options: {
                    selectors: {
                        videoAltText: ".sjrkc-st-block-media-alt-text",
                        videoDescription: ".sjrkc-st-block-media-description",
                        videoTranscript: ".sjrkc-st-block-media-transcript"
                    },
                    bindings: {
                        videoAltText: "alternativeText",
                        videoDescription: "description",
                        videoTranscript: "transcript"
                    }
                }
            },
            // handles previewing and uploading a single video for storage
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{videoBlockEditor}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectURL: "{block}.model.mediaUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{videoBlockEditor}.events.onVideoUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForVideoUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{videoBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

    // the extra interface elements to be added if the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor.hasMobileCamera", {
        selectors: {
            videoCaptureButton: ".sjrkc-st-block-media-capture-button",
            cameraCaptureUploader: ".sjrkc-st-block-camera-capture-input"
        },
        events: {
            videoCaptureRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.videoCaptureButton",
                method: "click",
                args: ["{that}.events.videoCaptureRequested.fire"],
                namespace: "bindVideoCaptureRequested"
            }
        },
        components: {
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplate": {
                            funcName: "{that}.renderTemplate",
                            args: [{hasMobileCamera: true}]
                        }
                    }
                }
            },
            // captures an video from the device, previews it and uploads it
            cameraCaptureUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{hasMobileCamera}.dom.cameraCaptureUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectURL: "{videoBlock}.model.mediaUrl",
                        fileDetails: "{videoBlock}.model.fileDetails"
                    },
                    listeners: {
                        "{hasMobileCamera}.events.videoCaptureRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForVideoCapture"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{videoBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
