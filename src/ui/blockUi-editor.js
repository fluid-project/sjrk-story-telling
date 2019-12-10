/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // the base blockUi for editing individual blocks, contains shared elements
    fluid.defaults("sjrk.storyTelling.blockUi.editor", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        selectors: {
            selectedCheckbox: ".sjrkc-st-block-selection-checkbox"
        },
        components: {
            // binds user input DOM elements to model values on the block
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{blockUi}.container",
                options: {
                    // TODO: remove this mergePolicy override once bug is fixed
                    // Until such time as the specification of "nomerge" on the
                    // bindings block is removed or changed, this will have to
                    // be overridden for merging to occur as we expect
                    // Issue tracked at: https://issues.gpii.net/browse/GPII-4259
                    mergePolicy: {
                        bindings: ""
                    },
                    model: "{block}.model",
                    selectors: {
                        heading: ".sjrkc-st-block-heading"
                    },
                    bindings: {
                        heading: "heading"
                    },
                    events: {
                        onUiReadyToBind: "{templateManager}.events.onTemplateRendered"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
