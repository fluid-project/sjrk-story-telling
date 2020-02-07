/*
Copyright 2017-2020 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // The data model for all stories
    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            title: "",
            content: [
                // a collection of sjrk.storyTelling.block data.
                // blocks contain the type of block and fields
                // specific to and consistent with that type.
                // e.g.
                // {
                //     blockType: "text",
                //     id: "id-123",
                //     language: "en-CA",
                //     heading: "An appropriate header",
                //     text: "This is the main text of this block",
                // }
            ],
            author: "",
            tags: []
        }
    });

})(jQuery, fluid);
