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

    fluid.defaults("sjrk.storyTelling.blockUi.editor", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        selectors: {
            selectedCheckbox: ".sjrkc-storyblock-selection-checkbox"
        },
        components: {
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{blockUi}.container",
                options: {
                    model: "{block}.model",
                    selectors: {
                        heading: ".sjrkc-storyblock-heading"
                    },
                    bindings: {
                        heading: "heading"
                    },
                    events: {
                        onUiReadyToBind: "{templateManager}.events.onTemplateRendered"
                    },
                    listeners: {
                        "onUiReadyToBind.applyBinding": {
                            funcName: "gpii.binder.applyBinding",
                            args: "{that}"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
