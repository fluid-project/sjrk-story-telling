/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // the data model of an image-type block
    fluid.defaults("sjrk.storyTelling.block.imageBlock", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            blockType: "image",
            imageUrl: null,
            alternativeText: null,
            description: null
        },
        modelRelay: {
            target: "contentString",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "sjrk.storyTelling.block.updateContentString",
                args: [["{that}.model.heading", "{that}.model.alternativeText", "{that}.model.description"], ". "]
            }
        }
    });



})(jQuery, fluid);
