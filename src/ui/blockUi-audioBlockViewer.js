/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // an interface for viewing an individual audio block
    fluid.defaults("sjrk.storyTelling.blockUi.audioBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi.timeBased"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBlockAudioView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.audioBlock"
            }
        }
    });

})(jQuery, fluid);
