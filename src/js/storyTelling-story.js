/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // The data model for all stories
    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            title: "",
            content:
            [
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
                //     simplifiedText: "Main text."
                // }
            ],
            contentString: "", // a string representation of the story content
            author: "",
            language: "",
            images: [],
            tags: [],
            keywordString: "", // a string representation of the tags
            categories: [],
            summary: "",
            timestampCreated: null,
            timestampModified: null,
            requestedTranslations: [
                //"es": 2, // a list of language codes as keys with
                //"fr": 5  // the number of requests for that language
            ],
            translationOf: null,
            thumbnailUrl: "", // filename/url of the thumbnail image for this story
            thumbnailAltText: "", // alternative text for the thumbnail image
            blockTypes: "" // the types of blocks present in this story
        },
        modelRelay: [{
            target: "contentString",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "sjrk.storyTelling.transforms.combineTerms",
                args: ["{that}.model.content", ". ", "contentString"]
            }
        },
        {
            source: "tags",
            target: "keywordString",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                separator: ", "
            }
        }]
    });

})(jQuery, fluid);
