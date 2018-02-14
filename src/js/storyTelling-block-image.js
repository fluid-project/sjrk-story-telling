/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.mobileCameraAware", {
        gradeNames: ["fluid.contextAware", "fluid.component"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        contextValue: "{fluid.platform.hasMobileCamera}",
                        // gradeNames: supplied by implementation
                    },
                    // defaultGradeNames: supplied by implementation
                }
            }
        }
    });

    sjrk.storyTelling.mobileCameraAware.hasMobileCamera = function () {
        var platform = navigator.platform.toLowerCase();
        var hasMobileCamera = platform.includes("iphone") || platform.includes("ipad") || platform.includes("android");
        return hasMobileCamera;
    };

    fluid.contextAware.makeChecks({
        "fluid.platform.hasMobileCamera": {
            funcName: "sjrk.storyTelling.mobileCameraAware.hasMobileCamera"
        }
    });

    fluid.defaults("sjrk.storyTelling.block.imageBlock.hasMobileCamera", {
        selectors: {
            imageCaptureButton: ".sjrkc-storyblock-image-capture-button",
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImage.handlebars"
                    }
                }
            }
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                    this: "{that}.dom.imageCaptureButton",
                    method: "click",
                    args: ["{that}.events.imageCaptureRequested.fire"],
                    namespace: "bindImageCaptureRequested"
                }
        }
    });

    fluid.defaults("sjrk.storyTelling.block.imageBlock", {
        gradeNames: ["sjrk.storyTelling.mobileCameraAware", "sjrk.storyTelling.block"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        gradeNames: "sjrk.storyTelling.block.imageBlock.hasMobileCamera"
                    }
                }
            }
        },
        model: {
            imageUrl: null,
            alternativeText: null,
            description: null
        },
        events: {
            imageUploadRequested: null,
            imageCaptureRequested: null
        },
        selectors: {
            imagePreview: ".sjrkc-storyblock-image-preview",
            imageUploadButton: ".sjrkc-storyblock-image-upload-button",
            imageAltText: ".sjrkc-storyblock-image-alt-text",
            imageDescription: ".sjrkc-storyblock-image-description",
            singleFileUploader: ".sjrkc-storyblock-uploader-input"
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.imageUploadButton",
                method: "click",
                args: ["{that}.events.imageUploadRequested.fire"],
                namespace: "bindImageUploadRequested"
            },
            "imageCaptureRequested.handleImageCaptureRequested": {
                func: "sjrk.storyTelling.block.imageBlock.handleCaptureRequested"
            }
        },
        invokers: {
            "updateImagePreview": {
                "this": "{that}.dom.imagePreview",
                "method": "attr",
                "args": ["src", "{arguments}.0"]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImage-noCamera.handlebars"
                    },
                    templateStrings: {
                        uiStrings: {
                            imageUploadButton: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageUploadButton)",
                            imageCaptureButton: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageCaptureButton)",
                            imageAltTextIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageAltText)",
                            imageDescriptionIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageDescription)"
                        }
                    }
                }
            },
            binder: {
                options: {
                    selectors: "{block}.options.selectors",
                    bindings: {
                        imageAltText: "alternativeText",
                        imageDescription: "description"
                    }
                }
            },
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{imageBlock}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    listeners: {
                        "{imageBlock}.events.imageUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{imageBlock}.updateImagePreview",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

    // TODO: placeholder
    sjrk.storyTelling.block.imageBlock.handleCaptureRequested = function () {
        console.log("sjrk.storyTelling.block.imageBlock.handleCaptureRequested");
    };

})(jQuery, fluid);
