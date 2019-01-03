/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // an editing interface for individual audio-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.audioBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor", "sjrk.storyTelling.blockUi.timeBased"],
        selectors: {
            audioUploadButton: ".sjrkc-st-block-audio-upload-button",
            singleFileUploader: ".sjrkc-st-block-uploader-input"
        },
        events: {
            onAudioUploadRequested: null
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                this: "{that}.dom.audioUploadButton",
                method: "click",
                args: ["{that}.events.onAudioUploadRequested.fire"],
                namespace: "bindOnAudioUploadRequested"
            }
        },
        components: {
            block: {
                type: "sjrk.storyTelling.block.audioBlock",
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
                        templatePath: "%resourcePrefix/src/templates/storyBlockAudio.handlebars"
                    }
                }
            },
            binder: {
                options: {
                    selectors: {
                        audioAltText: ".sjrkc-st-block-audio-alt-text",
                        audioDescription: ".sjrkc-st-block-audio-description",
                        audioTranscript: ".sjrkc-st-block-audio-transcript"
                    },
                    bindings: {
                        audioAltText: "alternativeText",
                        audioDescription: "description",
                        audioTranscript: "transcript"
                    }
                }
            },
            // handles previewing and uploading a single audio file for storage
            singleFileUploader: {
                type: "sjrk.storyTelling.block.singleFileUploader",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                container: "{audioBlockEditor}.dom.singleFileUploader",
                options: {
                    selectors: {
                        fileInput: "{that}.container"
                    },
                    model: {
                        fileObjectURL: "{block}.model.mediaUrl",
                        fileDetails: "{block}.model.fileDetails"
                    },
                    listeners: {
                        "{audioBlockEditor}.events.onAudioUploadRequested": {
                            func: "{that}.events.onUploadRequested.fire",
                            namespace: "fireUploadForAudioUpload"
                        }
                    },
                    modelListeners: {
                        "fileObjectURL": {
                            func: "{audioBlockEditor}.updateMediaPlayer",
                            args: "{that}.model.fileObjectURL",
                            excludeSource: "init"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
