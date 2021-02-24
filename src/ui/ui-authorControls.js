/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI representing the "author controls" part of a page, comprised of
    // either links to the login and sign up pages, or, if the author is logged
    // in, a greeting message and a logout button
    fluid.defaults("sjrk.storyTelling.ui.authorControls", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            logOutButton: ".sjrkc-st-author-log-out"
        },
        events: {
            onLogOutRequested: null
        },
        listeners: {
            "onReadyToBind.bindLogOutButton": {
                "this": "{that}.dom.logOutButton",
                "method": "click",
                "args": ["{that}.events.onLogOutRequested.fire"]
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/authorControls.hbs"
                    }
                }
            }
        }
    });
})(jQuery, fluid);
