/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The data model for all stories
    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            id: null, // the story ID, a UUID-V4 which is generated on creation
            title: "", // the story's title
            content: [
                // a collection of sjrk.storyTelling.block model data.
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
            author: "", // the author of the story, as displayed in the site
            tags: [], // the keywords associated with this story
            published: false, // indicates whether the story has been published
            // These timestamps are intended to be in ISO-8601 format and UTC time
            // https://en.wikipedia.org/wiki/ISO_8601
            // E.g. "2020-04-22T16:50:44.324Z"
            timestampCreated: "", // the date/time the story was initially created
            timestampPublished: "" // the date/time the story was initially published
        }
    });

})(jQuery, fluid);
