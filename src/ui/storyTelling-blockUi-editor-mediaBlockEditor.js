/*
Copyright 2019 OCAD University
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
        selectors: {
            mediaUploadButton: ".sjrkc-st-block-media-upload-button",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
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
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockMediaEdit.handlebars"
                    }
                }
            },
            binder: {
                options: {
                    selectors: {
                        mediaAltText: ".sjrkc-st-block-media-alt-text",
                        mediaDescription: ".sjrkc-st-block-media-description",
                        mediaTranscript: ".sjrkc-st-block-media-transcript"
                    },
                    bindings: {
                        mediaAltText: "alternativeText",
                        mediaDescription: "description",
                        mediaTranscript: "transcript"
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
                        fileObjectURL: "{block}.model.mediaUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{mediaBlockEditor}.events.onMediaUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForMediaUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{mediaBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
