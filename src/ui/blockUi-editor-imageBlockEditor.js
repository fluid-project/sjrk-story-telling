/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // an editing interface for individual image-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.withFileUploader"],
        selectors: {
            previewPlaceholder: ".sjrkc-st-block-media-preview-placeholder"
        },
        // links preview placeholder visibility with the preview itself.
        // this model listener is duplicated in the imageBlockEditor grade, and
        // the work to combine these grades is laid out by SJRK-175:
        // https://issues.fluidproject.org/browse/SJRK-175
        modelListeners: {
            previewVisible: {
                this: "{that}.dom.previewPlaceholder",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "placeholderVisibleChange"
            }
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                func: "{that}.updateMediaPreview",
                args: ["{that}.block.model.mediaUrl"],
                namespace: "updateMediaPreviewUrl"
            }
        },
        invokers: {
            updateMediaPreview: {
                this: "{that}.dom.mediaPreview",
                method: "attr",
                args: ["src", "{arguments}.0"]
            }
        },
        components: {
            // the block itself
            block: {
                type: "sjrk.storyTelling.block.imageBlock",
                options: {
                    model: {
                        // mediaUrl: relayed from uploader
                    }
                }
            },
            // the block's templateManager
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBlockMediaEdit.hbs"
                    }
                }
            },
            // binds the DOM to infusion model endpoints
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
            }
        }
    });

})(jQuery, fluid);
