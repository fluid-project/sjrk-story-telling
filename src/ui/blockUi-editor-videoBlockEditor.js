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

    // an editing interface for individual video-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor", "sjrk.storyTelling.blockUi.timeBased"],
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
            // the block itself
            block: {
                type: "sjrk.storyTelling.block.videoBlock",
                options: {
                    model: {
                        // mediaUrl: relayed from uploader
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
                        videoAltText: ".sjrkc-st-block-media-alt-text",
                        videoDescription: ".sjrkc-st-block-media-description"
                    },
                    bindings: {
                        videoAltText: "alternativeText",
                        videoDescription: "description"
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
                        fileObjectUrl: "{block}.model.mediaUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{videoBlockEditor}.events.onVideoUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForVideoUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectUrl": {
                            func: "{videoBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectUrl",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
