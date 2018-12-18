/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // mixin grade providing model endpoints for time-based media
    fluid.defaults("sjrk.storyTelling.block.timeBased", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            mediaUrl: null,
            alternativeText: null,
            transcript: null,
            description: null
        },
        modelRelay: {
            target: "contentString",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                input: ["{that}.model.heading", "{that}.model.alternativeText", "{that}.model.description", "{that}.model.transcript"],
                separator: ". ",
                stringOnly: true
            }
        }
    });

})(jQuery, fluid);
