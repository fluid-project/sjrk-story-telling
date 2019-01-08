/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // an editing interface for individual audio-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.audioBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.mediaBlockEditor"],
        components: {
            block: {
                type: "sjrk.storyTelling.block.audioBlock",
                options: {
                    model: {
                        // mediaUrl: relayed from uploader
                        // fileDetails: relayed from uploader
                    }
                }
            }
        }
    });

})(jQuery, fluid);
