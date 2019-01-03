/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // an interface for viewing an individual video block
    fluid.defaults("sjrk.storyTelling.blockUi.videoBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi", "sjrk.storyTelling.blockUi.timeBased"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockVideoView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.videoBlock"
            }
        }
    });

})(jQuery, fluid);
