/*
Copyright 2018 OCAD University
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
                // blocks should contain the type of block and fields
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
            tags: [],
            summary: "",
            thumbnailUrl: "", // filename/url of the thumbnail image for this story
            thumbnailAltText: "", // alternative text for the thumbnail image
            contentTypes: [] // a collection of the types of block present in this story
            // SJRK-132: commented out the following fields until needed
            // timestampCreated: null,
            // timestampModified: null,
            // requestedTranslations: [
            //     "es": 2, // a list of language codes as keys with
            //     "fr": 5  // the number of requests for that language
            // ],
            // translationOf: null,
        }
    });

})(jQuery, fluid);
