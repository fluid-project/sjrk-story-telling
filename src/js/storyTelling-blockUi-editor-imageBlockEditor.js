/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // an editing interface for individual image-type blocks
    // provides additional capabilities depending on whether the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditor", {
        gradeNames: ["sjrk.storyTelling.mobileCameraAware", "sjrk.storyTelling.blockUi.editor"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        gradeNames: "sjrk.storyTelling.blockUi.editor.imageBlockEditor.hasMobileCamera"
                    }
                }
            }
        },
        selectors: {
            imagePreview: ".sjrkc-storyblock-image-preview",
            imageUploadButton: ".sjrkc-storyblock-image-upload-button",
            singleFileUploader: ".sjrkc-storyblock-uploader-input"
        },
        invokers: {
            "updateImagePreview": {
                "this": "{that}.dom.imagePreview",
                "method": "attr",
                "args": ["src", "{arguments}.0"]
            }
        },
        events: {
            imageUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": [
                {
                    this: "{that}.dom.imageUploadButton",
                    method: "click",
                    args: ["{that}.events.imageUploadRequested.fire"],
                    namespace: "bindImageUploadRequested"
                },
                {
                    func: "{blockUi}.updateImagePreview",
                    args: ["{that}.block.model.imageUrl"],
                    namespace: "updateImagePreview"
                }
            ]
        },
        components: {
            block: {
                type: "sjrk.storyTelling.block.imageBlock",
                options: {
                    model: {
                        // imageURL: relayed from uploader
                        // fileDetails: relayed from uploader
                    }
                }
            },
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImage.handlebars"
                    }
                }
            },
            binder: {
                options: {
                    selectors: {
                        imageAltText: ".sjrkc-storyblock-image-alt-text",
                        imageDescription: ".sjrkc-storyblock-image-description"
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
                        fileObjectURL: "{block}.model.imageUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{imageBlockEditor}.events.imageUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForImageUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{imageBlockEditor}.updateImagePreview",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

    // Grade used to detect and enhance if a mobile camera is available
    // May not be super-reliable at this time
    // Assumes anything on iPhone, iPad or Android is a mobile
    // device with a camera
    fluid.defaults("sjrk.storyTelling.mobileCameraAware", {
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
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditor.hasMobileCamera", {
        selectors: {
            imageCaptureButton: ".sjrkc-storyblock-image-capture-button",
            cameraCaptureUploader: ".sjrkc-storyblock-camera-capture-input"
        },
        events: {
            imageCaptureRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.imageCaptureButton",
                method: "click",
                args: ["{that}.events.imageCaptureRequested.fire"],
                namespace: "bindImageCaptureRequested"
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
            // captures an image from the device, previews it and uploads it
            cameraCaptureUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{hasMobileCamera}.dom.cameraCaptureUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectURL: "{imageBlock}.model.imageUrl",
                        fileDetails: "{imageBlock}.model.fileDetails"
                    },
                    listeners: {
                        "{hasMobileCamera}.events.imageCaptureRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForImageCapture"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{imageBlockEditor}.updateImagePreview",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
