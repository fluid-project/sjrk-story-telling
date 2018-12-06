/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

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

    // Grade used to detect and enhance if a mobile camera is available
    // May not be super-reliable at this time
    // Assumes anything on iPhone, iPad or Android is a mobile
    // device with a camera
    fluid.defaults("sjrk.storyTelling.mobileCameraAware", {
        gradeNames: ["fluid.contextAware", "fluid.component"],
        contextAwareness: {
            technology: {
                checks: {
                    mobileCamera: {
                        contextValue: "{fluid.platform.hasMobileCamera}"
                        // gradeNames: supplied by implementation
                    }
                    // defaultGradeNames: supplied by implementation
                }
            }
        }
    });

    /* Determines whether the current user device has a "mobile" camera. */
    sjrk.storyTelling.mobileCameraAware.hasMobileCamera = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        var hasMobileCamera = userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("android");
        return hasMobileCamera;
    };

    fluid.contextAware.makeChecks({
        "fluid.platform.hasMobileCamera": {
            funcName: "sjrk.storyTelling.mobileCameraAware.hasMobileCamera"
        }
    });

})(jQuery, fluid);
