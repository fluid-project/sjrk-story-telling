/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // the common, shared data model of all blocks
    fluid.defaults("sjrk.storyTelling.block", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            //blockType: "", // to be supplied by implementing block formats
            id: null,
            language: null,
            heading: null,
            order: 0,
            firstInOrder: true,
            lastInOrder: true
        }
    });

})(jQuery, fluid);
