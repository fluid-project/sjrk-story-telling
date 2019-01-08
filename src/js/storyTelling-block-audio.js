/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // the data model of a audio-type block
    fluid.defaults("sjrk.storyTelling.block.audioBlock", {
        gradeNames: ["sjrk.storyTelling.block.timeBased"],
        model: {
            blockType: "audio"
        }
    });

})(jQuery, fluid);
