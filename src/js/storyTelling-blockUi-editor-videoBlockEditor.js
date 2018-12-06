/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // an editing interface for individual video-type blocks
    // provides additional capabilities depending on whether the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.mobileCameraAware.video", "sjrk.storyTelling.blockUi.editor"],
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
            videoPreview: ".sjrkc-st-block-videp-preview",
            videoUploadButton: ".sjrkc-st-block-video-upload-button",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        invokers: {
            "updateVideoPreview": {
                "this": "{that}.dom.videoPreview",
                "method": "attr",
                "args": ["src", "{arguments}.0"]
            }
        },
        events: {
            videoUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": [
                {
                    this: "{that}.dom.videoUploadButton",
                    method: "click",
                    args: ["{that}.events.videoUploadRequested.fire"],
                    namespace: "bindVideoUploadRequested"
                },
                {
                    func: "{blockUi}.updateVideoPreview",
                    args: ["{that}.block.model.videoUrl"],
                    namespace: "updateVideoPreview"
                }
            ]
        },
        components: {
            block: {
                type: "sjrk.storyTelling.block.videoBlock",
                options: {
                    model: {
                        // videoURL: relayed from uploader
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
                        videoAltText: ".sjrkc-st-block-video-alt-text",
                        videoDescription: ".sjrkc-st-block-video-description",
                        videoTranscript: ".sjrkc-st-block-video-transcript"
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
                        fileObjectURL: "{block}.model.videoUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{videoBlockEditor}.events.videoUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForVideoUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{videoBlockEditor}.updateVideoPreview",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

    // TODO: move this to a centralized location that imageBlockEditor can use
    // Grade used to detect and enhance if a mobile camera is available
    // May not be super-reliable at this time
    // Assumes anything on iPhone, iPad or Android is a mobile
    // device with a camera
    fluid.defaults("sjrk.storyTelling.mobileCameraAware.video", {
        gradeNames: ["fluid.contextAware", "fluid.component"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        contextValue: "{fluid.platform.hasMobileCamera}"
                        // gradeNames: supplied by implementation
                    }
                    // defaultGradeNames: supplied by implementation
                }
            }
        }
    });

    /* Determines whether the current user device has a "mobile" camera. */
    sjrk.storyTelling.mobileCameraAware.hasMobileCamera = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        var hasMobileCamera = userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("android");
        return hasMobileCamera;
    };

    fluid.contextAware.makeChecks({
        "fluid.platform.hasMobileCamera": {
            funcName: "sjrk.storyTelling.mobileCameraAware.hasMobileCamera"
        }
    });

    // the extra interface elements to be added if the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor.hasMobileCamera", {
        selectors: {
            videoCaptureButton: ".sjrkc-st-block-video-capture-button",
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
                        fileObjectURL: "{videoBlock}.model.videoUrl",
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
                            func: "{videoBlockEditor}.updateVideoPreview",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
