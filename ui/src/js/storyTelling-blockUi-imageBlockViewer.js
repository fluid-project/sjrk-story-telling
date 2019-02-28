/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // an interface for viewing an individual image block
    fluid.defaults("sjrk.storyTelling.blockUi.imageBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImageView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.imageBlock"
            }
        }
    });

})(jQuery, fluid);
