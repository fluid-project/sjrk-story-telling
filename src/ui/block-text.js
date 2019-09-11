/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // the data model of a text-type block
    fluid.defaults("sjrk.storyTelling.block.textBlock", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            blockType: "text",
            text: null
        },
        modelRelay: {
            target: "contentString",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                input: ["{that}.model.heading", "{that}.model.text"],
                delimiter: ". "
            }
        }
    });

})(jQuery, fluid);
