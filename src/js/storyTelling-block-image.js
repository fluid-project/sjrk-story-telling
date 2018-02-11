/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.block.image", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            imageUrl: null,
            alternativeText: null,
            description: null
        },
        selectors: {
            imagePreview: ".sjrkc-storyblock-image-preview",
            imageCaptureButton: ".sjrkc-storyblock-image-capture-button",
            imageUploadButton: ".sjrkc-storyblock-image-upload-button",
            imageAltText: ".sjrkc-storyblock-image-alt-text",
            imageDescription: ".sjrck-storyblock-image-description"
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImage.handlebars"
                    },
                    templateStrings: {
                        uiStrings: {
                            // TODO: think about the usage/location of this function
                            imageUploadButton: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageUploadButton)",
                            imageCaptureButton: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageCaptureButton)",
                            imageAltText: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageAltText)",
                            imageDescription: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockImageDescription)"
                        }
                    }
                }
            },
            binder: {
                options: {
                    selectors: "{block}.options.selectors",
                    bindings: {
                        textBlock: "text"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
