/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

// TODO: Once https://issues.fluidproject.org/browse/SJRK-416 has been completed to make the end points more restful,
// it may be possible to remove this component and related work. Which is a stop gap for rendering a page indicating
// that a story couldn't be found. With SJRK-416 a proper 404 workflow should be adopted.

"use strict";

(function ($, fluid) {

    // The storyNotFound page base grade
    fluid.defaults("sjrk.storyTelling.base.page.storyNotFound", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        storyId: "",
        events: {
            onAllUiComponentsReady: {
                events: {
                    onNotFoundNoticeReady: "{notFound}.events.onControlsBound"
                }
            }
        },
        components: {
            // error message interface
            notFound: {
                type: "sjrk.storyTelling.ui.storyNotFound",
                container: ".sjrkc-st-story-notFoundNotice"
            }
        },
        distributeOptions: {
            "storyId": {
                source: "{that}.options.storyId",
                target: "{that notFound templateManager}.options.model.dynamicValues.story.id"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.ui.storyNotFound", {
        gradeNames: ["sjrk.storyTelling.ui"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyNotFound.hbs"
                    }
                }
            }
        }
    });



})(jQuery, fluid);
