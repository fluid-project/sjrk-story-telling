/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // an interface for viewing an individual video block
    fluid.defaults("sjrk.storyTelling.blockUi.videoBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi.timeBased"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBlockVideoView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.videoBlock"
            }
        }
    });

})(jQuery, fluid);
