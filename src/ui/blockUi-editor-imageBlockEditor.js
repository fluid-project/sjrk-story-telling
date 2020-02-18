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
                        templatePath: "%resourcePrefix/templates/storyBlockMediaEdit.handlebars"
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

})(jQuery, fluid);
