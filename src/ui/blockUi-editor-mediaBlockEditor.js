/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // an editing interface for individual media blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.mediaBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.withFileUploader", "sjrk.storyTelling.blockUi.timeBased"],
        selectors: {
            previewPlaceholder: ".sjrkc-st-block-media-preview-placeholder"
        },
        // links preview placeholder visibility with the preview itself.
        // this model listener is duplicated in the mediaBlockEditor grade, and
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
        components: {
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
                        mediaAltText: ".sjrkc-st-block-media-alt-text",
                        mediaDescription: ".sjrkc-st-block-media-description"
                    },
                    bindings: {
                        mediaAltText: "alternativeText",
                        mediaDescription: "description"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
