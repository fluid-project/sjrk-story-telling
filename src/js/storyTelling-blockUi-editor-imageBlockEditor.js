/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

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
            imagePreview: ".sjrkc-st-block-media-preview",
            imageUploadButton: ".sjrkc-st-block-media-upload-button",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        invokers: {
            "updateImagePreview": {
                "this": "{that}.dom.imagePreview",
                "method": "attr",
                "args": ["src", "{arguments}.0"]
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
                        fileObjectURL: "{block}.model.imageUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{imageBlockEditor}.events.onImageUploadRequested": {
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

    // the extra interface elements to be added if the device has a camera
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditor.hasMobileCamera", {
        selectors: {
            imageCaptureButton: ".sjrkc-st-block-media-capture-button",
            cameraCaptureUploader: ".sjrkc-st-block-camera-capture-input"
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
