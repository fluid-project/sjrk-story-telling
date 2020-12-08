/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // the data model of an image-type block
    fluid.defaults("sjrk.storyTelling.block.imageBlock", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            blockType: "image",
            mediaUrl: null,
            alternativeText: null,
            description: null
        }
    });

})(jQuery, fluid);
