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

    // A simple single-file uploader using what's presumed to be a hidden
    // <input type="file">
    //
    // This component is expected to be used with existing markup
    fluid.defaults("sjrk.storyTelling.block.singleFileUploader", {
        gradeNames: ["fluid.viewComponent"],
        members: {
            currentFile: null
        },
        // Holds a fileObjectURL for file preview purposes
        model: {
            fileObjectURL: null
        },
        events: {
            onUploadRequested: null,
            onFileChanged: null
        },
        selectors: {
            // Supplied by implementing component
            fileInput: null
        },
        listeners: {
            "onCreate.addFileInputChangeListener": {
                "this": "{that}.dom.fileInput",
                "method": "change",
                "args": ["{that}.handleFileInputChange"]
            },
            "onUploadRequested.clickHiddenFileInput": {
                "this": "{that}.dom.fileInput",
                "method": "click",
                "args": []
            },
            "onFileChanged.updateFileObjectURL": {
                "func": "sjrk.storyTelling.block.singleFileUploader.updateFileObjectURL",
                "args": ["{that}", "{that}.currentFile"]
            }
        },
        invokers: {
            "handleFileInputChange": {
                funcName: "sjrk.storyTelling.block.singleFileUploader.handleFileInputChange",
                args: ["{that}", "{that}.dom.fileInput"]
            }
        }
    });

    sjrk.storyTelling.block.singleFileUploader.handleFileInputChange = function (that, fileInput) {
        var fileList = fileInput[0].files;
        var currentFile = fileList[0];
        that.currentFile = currentFile;
        that.events.onFileChanged.fire();
    };

    sjrk.storyTelling.block.singleFileUploader.updateFileObjectURL = function (that, currentFile) {
        URL.revokeObjectURL(that.model.fileObjectURL);
        that.applier.change("fileObjectURL", URL.createObjectURL(currentFile));
    };

    fluid.defaults("sjrk.storyTelling.block.imageBlock", {
        gradeNames: ["sjrk.storyTelling.block"],
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
            imageCaptureButton: ".sjrkc-storyblock-image-capture-button",
            imageUploadButton: ".sjrkc-storyblock-image-upload-button",
            imageAltText: ".sjrkc-storyblock-image-alt-text",
            imageDescription: ".sjrkc-storyblock-image-description",
            singleFileUploader: ".sjrkc-storyblock-uploader"
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": [{
                this: "{that}.dom.imageUploadButton",
                method: "click",
                args: ["{that}.events.imageUploadRequested.fire"],
                namespace: "bindImageUploadRequested"
            }, {
                this: "{that}.dom.imageCaptureButton",
                method: "click",
                args: ["{that}.events.imageCaptureRequested.fire"],
                namespace: "bindImageCaptureRequested"
            }],
            "imageCaptureRequested.handleImageCaptureRequested": {
                func: "sjrk.storyTelling.block.imageBlock.handleCaptureRequested"
            }
        },
        invokers: {
            "updateImagePreview": {
                "this": "{that}.dom.imagePreview",
                "method": "attr",
                "args": ["src", "{singleFileUploader}.model.fileObjectURL"]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImage.handlebars"
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
                container: "{that}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: ".sjrkc-storyblock-uploader-input"
                    },
                    listeners: {
                        "{imageBlock}.events.imageUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{imageBlock}.updateImagePreview",
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
