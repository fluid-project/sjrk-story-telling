/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // an editing interface for individual video-type blocks
    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.mediaBlockEditor"],
        components: {
            // the block itself
            block: {
                type: "sjrk.storyTelling.block.videoBlock",
                options: {
                    model: {
                        // mediaUrl: relayed from uploader
                    }
                }
            }
        }
    });

})(jQuery, fluid);
